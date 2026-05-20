export const studioDemo = {
  id: "ice-house",
  name: "ICE HOUSE Recovery Lab",
  location: "Ekkamai",
  distance: "350 m",
  rating: "4.8",
  reviews: "326",
  price: "฿450",
  credits: "4",
  hero:
    "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1200&q=85",
  classHero:
    "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&w=1200&q=85",
  map:
    "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=80",
  tags: ["Ice Bath", "Recovery", "Sauna", "Premium"],
  gallery: [
    "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1600881333168-2ef49b341f30?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1529357476361-473477772fcb?auto=format&fit=crop&w=900&q=85",
  ],
  classes: [
    {
      id: "guided-ice-bath",
      title: "Guided Ice Bath",
      rating: "4.9",
      reviews: "128",
      level: "Beginner",
      tags: ["Ice Bath", "Recovery", "Beginner", "Premium"],
      image:
        "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&w=900&q=85",
      times: ["10:00", "11:30", "13:00", "15:30", "17:00", "19:00"],
    },
    {
      id: "contrast-therapy-reset",
      title: "Contrast Therapy Reset",
      rating: "4.8",
      reviews: "96",
      level: "Advanced",
      tags: ["Recovery", "Ice Bath", "Sauna"],
      image:
        "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=900&q=85",
      times: ["15:00", "16:00", "16:30", "17:00", "18:30", "19:00"],
    },
    {
      id: "sauna-recovery-flow",
      title: "Sauna & Recovery Flow",
      rating: "4.7",
      reviews: "74",
      level: "All Levels",
      tags: ["Sauna", "Recovery", "Relax"],
      image:
        "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=900&q=85",
      times: ["14:30", "15:30", "16:00", "17:00", "18:30", "20:00"],
    },
  ],
  reviewsList: [
    {
      name: "Michael T.",
      count: "77 reviews",
      rating: "5.0",
      date: "4d ago",
      text: "The guided ice bath was intense in the best way. I left feeling focused, recharged, and ready to take on the day.",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
    },
    {
      name: "Nataporn S.",
      count: "42 reviews",
      rating: "5.0",
      date: "1w ago",
      text: "Contrast Therapy Reset was exactly what I needed. The alternating heat and cold left me feeling amazing.",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    },
    {
      name: "James L.",
      count: "58 reviews",
      rating: "4.8",
      date: "3w ago",
      text: "Beautiful facility and incredible instructors. The recovery lab experience is second to none.",
      avatar:
        "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80",
    },
  ],
} as const;

export const studioDateFilters = ["Today\n13 May", "Wed\n14 May", "Thu\n15 May", "Fri\n16 May", "Sat\n17 May"];
export const studioCategories = ["All Classes", "Recovery", "Packages", "Reviews", "Gallery"];
