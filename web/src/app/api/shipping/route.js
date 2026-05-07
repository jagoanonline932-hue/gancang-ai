// Simulasi kalkulator ongkir domestik (RajaOngkir-style)
// Bisa diganti integrasi RajaOngkir sungguhan dengan API key user

const ZONE_RATES = {
  // tarif per kg per zona (IDR)
  jabodetabek: {
    jne: 12000,
    jnt: 11000,
    sicepat: 10000,
    anteraja: 10000,
    pos: 9000,
  },
  jawa: { jne: 18000, jnt: 17000, sicepat: 16000, anteraja: 16000, pos: 14000 },
  sumatera: {
    jne: 28000,
    jnt: 26000,
    sicepat: 25000,
    anteraja: 25000,
    pos: 22000,
  },
  kalimantan: {
    jne: 35000,
    jnt: 33000,
    sicepat: 32000,
    anteraja: 32000,
    pos: 28000,
  },
  sulawesi: {
    jne: 38000,
    jnt: 36000,
    sicepat: 35000,
    anteraja: 35000,
    pos: 30000,
  },
  indonesia_timur: {
    jne: 55000,
    jnt: 52000,
    sicepat: 50000,
    anteraja: 50000,
    pos: 45000,
  },
};

const CITY_TO_ZONE = {
  jakarta: "jabodetabek",
  bekasi: "jabodetabek",
  tangerang: "jabodetabek",
  depok: "jabodetabek",
  bogor: "jabodetabek",
  bandung: "jawa",
  semarang: "jawa",
  yogyakarta: "jawa",
  jogja: "jawa",
  surabaya: "jawa",
  malang: "jawa",
  solo: "jawa",
  medan: "sumatera",
  palembang: "sumatera",
  padang: "sumatera",
  pekanbaru: "sumatera",
  lampung: "sumatera",
  pontianak: "kalimantan",
  banjarmasin: "kalimantan",
  balikpapan: "kalimantan",
  samarinda: "kalimantan",
  makassar: "sulawesi",
  manado: "sulawesi",
  palu: "sulawesi",
  kendari: "sulawesi",
  jayapura: "indonesia_timur",
  ambon: "indonesia_timur",
  kupang: "indonesia_timur",
  manokwari: "indonesia_timur",
};

function detectZone(city) {
  if (!city) return "jawa";
  const lower = city.toLowerCase().trim();
  for (const key of Object.keys(CITY_TO_ZONE)) {
    if (lower.includes(key)) return CITY_TO_ZONE[key];
  }
  return "jawa";
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { destination_city, weight_grams = 1000 } = body;
    if (!destination_city) {
      return Response.json(
        { error: "destination_city wajib" },
        { status: 400 },
      );
    }

    const zone = detectZone(destination_city);
    const weightKg = Math.max(1, Math.ceil(weight_grams / 1000));
    const rates = ZONE_RATES[zone];

    const services = Object.keys(rates).map((courier) => {
      const cost = rates[courier] * weightKg;
      const etd =
        zone === "jabodetabek"
          ? "1-2 hari"
          : zone === "jawa"
            ? "2-3 hari"
            : zone === "sumatera"
              ? "3-5 hari"
              : zone === "kalimantan"
                ? "4-6 hari"
                : zone === "sulawesi"
                  ? "4-6 hari"
                  : "6-10 hari";
      return {
        courier: courier.toUpperCase(),
        service: "Reguler",
        cost,
        etd,
      };
    });

    return Response.json({
      destination_city,
      zone,
      weight_kg: weightKg,
      services,
    });
  } catch (error) {
    console.error("POST /api/shipping error:", error);
    return Response.json({ error: "Gagal hitung ongkir" }, { status: 500 });
  }
}
