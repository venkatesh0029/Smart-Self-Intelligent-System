"""
Database connections and session management
"""
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from pymongo import MongoClient
import redis
from typing import Generator
import logging

from .config import settings

logger = logging.getLogger(__name__)

# PostgreSQL
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=20
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db() -> Generator[Session, None, None]:
    """Get database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# MongoDB
try:
    mongo_client = MongoClient(settings.MONGODB_URL)
    mongo_db = mongo_client.get_database()
    logger.info("MongoDB connected successfully")
except Exception as e:
    logger.error(f"MongoDB connection failed: {e}")
    mongo_db = None


def get_mongo_db():
    """Get MongoDB database"""
    return mongo_db


# Redis
try:
    redis_client = redis.from_url(settings.REDIS_URL, decode_responses=True)
    redis_client.ping()
    logger.info("Redis connected successfully")
except Exception as e:
    logger.error(f"Redis connection failed: {e}")
    redis_client = None


def get_redis():
    """Get Redis client"""
    return redis_client