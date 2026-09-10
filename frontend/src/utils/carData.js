export const carData = {
  "Tüm Markalar / Evrensel (Universal)": ["Evrensel (Universal)"],
  "Alfa Romeo": ["Giulia", "Giulietta", "Stelvio", "Tonale"],
  "Audi": ["A1", "A3", "A4", "A5", "A6", "A7", "Q2", "Q3", "Q5", "Q7", "Q8"],
  "BMW": ["1 Serisi", "2 Serisi", "3 Serisi", "4 Serisi", "5 Serisi", "7 Serisi", "X1", "X3", "X5", "X6", "M3", "M4"],
  "BYD": ["Atto 3", "Seal", "Dolphin"],
  "Chery": ["Tiggo 7 Pro", "Tiggo 8 Pro", "Omoda 5"],
  "Chevrolet": ["Aveo", "Camaro", "Captiva", "Corvette", "Cruze"],
  "Citroen": ["C3", "C3 Aircross", "C4", "C4 Cactus", "C5 Aircross", "Berlingo"],
  "Cupra": ["Formentor", "Leon"],
  "Dacia": ["Duster", "Sandero", "Sandero Stepway", "Logan", "Jogger", "Spring"],
  "Dodge": ["Challenger", "Charger", "Nitro"],
  "Fiat": ["Egea", "Egea Cross", "Fiorino", "Doblo", "Panda", "500", "Linea"],
  "Ford": ["Focus", "Fiesta", "Puma", "Kuga", "Mustang", "Transit", "Courier"],
  "Honda": ["Civic", "Accord", "CR-V", "HR-V", "City", "Jazz"],
  "Hyundai": ["i10", "i20", "i30", "Elantra", "Tucson", "Bayon", "Kona"],
  "Infiniti": ["FX35", "Q50"],
  "Jaguar": ["XE", "XF", "F-Pace"],
  "Kia": ["Picanto", "Rio", "Ceed", "Cerato", "Sportage", "Stonic", "Sorento"],
  "Lexus": ["CT", "ES", "IS", "NX", "RX"],
  "Maserati": ["Ghibli", "Levante"],
  "Mazda": ["Mazda3", "Mazda6", "CX-3", "CX-5"],
  "Mercedes-Benz": ["A-Serisi", "B-Serisi", "C-Serisi", "E-Serisi", "S-Serisi", "CLA", "GLA", "GLC", "GLE", "G-Serisi"],
  "Mini": ["Cooper", "Countryman", "Clubman"],
  "Mitsubishi": ["L200", "Space Star", "ASX"],
  "Nissan": ["Micra", "Juke", "Qashqai", "X-Trail", "Navara"],
  "Opel": ["Corsa", "Astra", "Crossland", "Mokka", "Grandland", "Insignia"],
  "Peugeot": ["208", "2008", "308", "3008", "408", "508", "5008", "Rifter"],
  "Porsche": ["911", "Cayenne", "Macan", "Panamera", "Taycan"],
  "Renault": ["Clio", "Megane", "Taliant", "Captur", "Austral", "Kadjar", "Symbol"],
  "Seat": ["Ibiza", "Leon", "Arona", "Ateca", "Tarraco"],
  "Skoda": ["Fabia", "Scala", "Octavia", "Superb", "Kamiq", "Karoq", "Kodiaq"],
  "Subaru": ["XV", "Forester", "Outback"],
  "Suzuki": ["Swift", "Vitara", "S-Cross", "Jimny"],
  "Tesla": ["Model 3", "Model S", "Model X", "Model Y"],
  "Tofaş": ["Doğan", "Şahin", "Kartal"],
  "TOGG": ["T10X"],
  "Toyota": ["Corolla", "Yaris", "C-HR", "RAV4", "Hilux", "Auris"],
  "Volkswagen": ["Polo", "Golf", "Passat", "T-Roc", "Tiguan", "Arteon", "Touareg", "Caddy", "Transporter"],
  "Volvo": ["V40", "S60", "S90", "XC40", "XC60", "XC90"]
};

// Helper function to get sorted models for a brand
export const getModelsForBrand = (brand) => {
  if (!brand || !carData[brand]) return [];
  // Sort models alphabetically
  return [...carData[brand]].sort();
};

// Array of brands sorted alphabetically (except 'Tüm Markalar' which should be first)
export const getSortedBrands = () => {
  const brands = Object.keys(carData).filter(b => b !== "Tüm Markalar / Evrensel (Universal)").sort();
  return ["Tüm Markalar / Evrensel (Universal)", ...brands];
};
