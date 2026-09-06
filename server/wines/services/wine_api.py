import os

import requests
from dotenv import load_dotenv


load_dotenv()

WINE_API_BASE_URL = "https://api.wineapi.io"
WINE_API_KEY = os.getenv("WINE_API_KEY")


def get_headers():
    return {
        "X-API-Key": WINE_API_KEY,
    }


def search_wines(query):
    response = requests.get(
        f"{WINE_API_BASE_URL}/wines/search",
        params={"q": query},
        headers=get_headers(),
        timeout=15,
    )

    response.raise_for_status()

    data = response.json()

    results = data.get("results", [])

    return [
        normalize_search_result(result)
        for result in results
    ]


def get_wine_details(wine_id):
    response = requests.get(
        f"{WINE_API_BASE_URL}/wines/{wine_id}",
        headers=get_headers(),
        timeout=15,
    )

    response.raise_for_status()

    return response.json()


def normalize_wine_details(data):
    winery = data.get("winery") or {}
    region = data.get("region") or {}
    grapes = data.get("grapes") or []
    pairings = data.get("pairings") or []

    varietal = grapes[0].get("name", "") if grapes else ""

    return {
        "external_api_id": data.get("id"),
        "external_source": "wineapi",

        "name": data.get("name", ""),
        "vintage": data.get("vintage"),
        "wine_type": data.get("type", ""),

        "winery": winery.get("name", ""),
        "region": region.get("name", ""),
        "country": region.get("country", ""),
        "varietal": varietal,

        "description": data.get("description") or "",
        "image_url": data.get("imageUrl") or "",

        "body": data.get("body") or "",
        "acidity": data.get("acidity") or "",
        "alcohol_content": data.get("alcoholContent"),

        "price_range": data.get("priceRange"),
        "external_rating": data.get("averageRating"),
        "external_rating_count": data.get("ratingsCount", 0),

        "pairings": [
            pairing.get("food")
            for pairing in pairings
            if pairing.get("food")
        ],
    }


def normalize_search_result(data):
    return {
        "external_api_id": data.get("id"),
        "external_source": "wineapi",
        "name": data.get("name", ""),
        "vintage": data.get("vintage"),
        "wine_type": data.get("type", ""),
        "winery": data.get("winery", ""),
        "region": data.get("region", ""),
        "country": data.get("country", ""),
        "external_rating": data.get("averageRating"),
        "external_rating_count": data.get("ratingsCount", 0),
        "confidence": data.get("confidence"),
    }