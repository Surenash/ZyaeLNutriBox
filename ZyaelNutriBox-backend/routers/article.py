from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from db import get_db
import models, schemas

router = APIRouter(
    prefix="/api/articles",
    tags=["Media & Articles"]
)

# --- MEDIA AUTHENTICATION ---
def get_media_admin(user_id: str):
    """Allows BOTH Grandmasters (ADMN) and Media Team (MEDI) to post/edit."""
    if not user_id or not (user_id.startswith("ADMN") or user_id.startswith("MEDI")):
        raise HTTPException(status_code=403, detail="Unauthorized. Must be an Admin or Media Team member to modify articles.")
    return user_id


# ==========================================
# 1. POST AN ARTICLE (Media Team Only)
# ==========================================

@router.post("/", status_code=status.HTTP_201_CREATED)
def create_article(data: schemas.ArticleCreate, user_id: str = Depends(get_media_admin), db: Session = Depends(get_db)):
    """Upload a new food article to the database."""
    
    new_article = models.Article(
        headline=data.headline,
        content=data.content,
        source=data.source,
        link=data.link,
        imageUrl=data.imageUrl,
        publishedDate=data.publishedDate if data.publishedDate else datetime.utcnow()
    )
    
    db.add(new_article)
    db.commit()
    db.refresh(new_article)
    
    return {"message": "Article published successfully to the NutriBox feed!"}


# ==========================================
# 2. UPDATE AN ARTICLE (Media Team Only)
# ==========================================

@router.put("/{article_id}")
def update_article(article_id: str, data: schemas.ArticleCreate, user_id: str = Depends(get_media_admin), db: Session = Depends(get_db)):
    """Edit an existing article."""
    article = db.query(models.Article).filter(models.Article.id == article_id).first()
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
        
    article.headline = data.headline
    article.content = data.content
    article.source = data.source if data.source != "" else None
    article.link = data.link if data.link != "" else None
    article.imageUrl = data.imageUrl if data.imageUrl != "" else None
    
    db.commit()
    return {"message": "Article updated successfully"}


# ==========================================
# 3. DELETE AN ARTICLE (Media Team Only)
# ==========================================

@router.delete("/{article_id}")
def delete_article(article_id: str, user_id: str = Depends(get_media_admin), db: Session = Depends(get_db)):
    """Remove an article from the public feed."""
    article = db.query(models.Article).filter(models.Article.id == article_id).first()
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
        
    db.delete(article)
    db.commit()
    return {"message": "Article deleted successfully"}


# ==========================================
# 4. FETCH ARTICLES (Public / Customers)
# ==========================================

@router.get("/", response_model=List[schemas.ArticleResponse])
def get_articles(limit: int = 20, db: Session = Depends(get_db)):
    """Fetch the latest articles to display on the Customer or Public dashboard."""
    
    articles = db.query(models.Article).order_by(models.Article.publishedDate.desc()).limit(limit).all()
    
    response = []
    for art in articles:
        response.append({
            "id": art.id,
            "headline": art.headline,
            "content": art.content,
            "source": art.source,
            "link": art.link,
            "imageUrl": art.imageUrl,
            "publishedDate": art.publishedDate,
            "createdAt": art.createdAt
        })
        
    return response