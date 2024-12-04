nail_diseases = {
    "Acral Lentiginous Melanoma": 2008,
    "Alopecia Areata": 94,
    "Beau's Lines": 1629,
    "Black Line": 100,
    "Blue Fingers": 1293,
    "Bluish Nails": 851,
    "Clubbing": 1746,
    "Darier Nails": 55,
    "Eczema": 289,
    "Hang Nail": 18,
    "Healthy Nails": 2221,
    "Koilonychia": 1189,
    "Leukonychia": 109,
    "Lindsay's Nails": 117,
    "Median Nail": 184,
    "Melanoma": 181,
    "Muehrcke's Lines": 940,
    "Nail Pitting": 1110,
    "Normal Nails": 918,
    "Onychocryptosis": 118,
    "Onychogryphosis": 1972,
    "Onycholysis": 1023,
    "Onychomycosis": 968,
    "Pachyonychia Congenita": 39,
    "Pale Nail": 35,
    "Paronychia": 279,
    "Pincer Nails": 94,
    "Pseudomonas": 172,
    "Psoriasis": 815,
    "Red Lunula": 39,
    "Ridging/Beading": 164,
    "Splinter Hemorrhage": 120,
    "Subungual Hematoma": 195,
    "Terry's Nails": 1554,
    "Trachyonychia": 222,
    "Unlabeled": 63,
    "White Nails": 112,
    "White Spot": 52,
    "Yellow Nails": 222
}

# Sorting the dictionary by values in descending order
sorted_nail_diseases = sorted(nail_diseases.items(), key=lambda item: item[1], reverse=True)

# Printing in simple comma-separated format
print(", ".join(f"{name} ({count})" for name, count in sorted_nail_diseases))
print(len(nail_diseases))
