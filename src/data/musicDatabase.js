// Comprehensive music database with rich metadata
export const musicDatabase = {
  songs: [
    {
      id: "1",
      title: "Bohemian Rhapsody",
      shortDescription: "Epic rock opera masterpiece with operatic sections and hard rock finale",
      artists: ["Queen", "Freddie Mercury"],
      primaryArtist: "Queen",
      album: "A Night at the Opera",
      albumArt: "https://upload.wikimedia.org/wikipedia/en/4/4d/Queen_A_Night_at_the_Opera.png",
      duration: 355, // 5:55
      genre: "Rock",
      subGenres: ["Progressive Rock", "Opera Rock"],
      releaseYear: 1975,
      youtubeUrl: "https://www.youtube.com/watch?v=fJ9rUzIMcZQ",
      youtubeVideoId: "fJ9rUzIMcZQ",
      spotifyUrl: "https://open.spotify.com/track/4u7EnebtmKWzUH433cf5Qv",
      lyrics: [
        { time: 0, text: "Is this the real life?", translation: "" },
        { time: 3, text: "Is this just fantasy?", translation: "" },
        { time: 6, text: "Caught in a landslide", translation: "" },
        { time: 9, text: "No escape from reality", translation: "" },
        { time: 13, text: "Open your eyes", translation: "" },
        { time: 16, text: "Look up to the skies and see", translation: "" }
      ],
      mood: "Epic",
      energy: 0.8,
      danceability: 0.6,
      valence: 0.7,
      tempo: 72,
      key: "Bb major",
      tags: ["classic", "epic", "opera", "rock", "legendary"],
      playCount: 1250000,
      likes: 89500,
      isExplicit: false,
      language: "English",
      country: "UK"
    },
    {
      id: "2",
      title: "Imagine",
      shortDescription: "Peaceful anthem promoting unity and hope for humanity",
      artists: ["John Lennon"],
      primaryArtist: "John Lennon",
      album: "Imagine",
      albumArt: "https://upload.wikimedia.org/wikipedia/en/1/1d/John_Lennon_-_Imagine_John_Lennon.jpg",
      duration: 183, // 3:03
      genre: "Pop",
      subGenres: ["Soft Rock", "Folk Rock"],
      releaseYear: 1971,
      youtubeUrl: "https://www.youtube.com/watch?v=YkgkThdzX-8",
      youtubeVideoId: "YkgkThdzX-8",
      spotifyUrl: "https://open.spotify.com/track/7pKfPomDEeI4TPT6EOYjn9",
      lyrics: [
        { time: 0, text: "Imagine there's no heaven", translation: "" },
        { time: 4, text: "It's easy if you try", translation: "" },
        { time: 8, text: "No hell below us", translation: "" },
        { time: 12, text: "Above us only sky", translation: "" },
        { time: 16, text: "Imagine all the people", translation: "" },
        { time: 20, text: "Living for today", translation: "" }
      ],
      mood: "Peaceful",
      energy: 0.3,
      danceability: 0.4,
      valence: 0.8,
      tempo: 76,
      key: "C major",
      tags: ["peace", "hope", "classic", "inspirational", "timeless"],
      playCount: 980000,
      likes: 75200,
      isExplicit: false,
      language: "English",
      country: "UK"
    },
    {
      id: "3",
      title: "Billie Jean",
      shortDescription: "Iconic pop track with infectious bassline and memorable dance moves",
      artists: ["Michael Jackson"],
      primaryArtist: "Michael Jackson",
      album: "Thriller",
      albumArt: "https://upload.wikimedia.org/wikipedia/en/5/55/Michael_Jackson_-_Thriller.png",
      duration: 294, // 4:54
      genre: "Pop",
      subGenres: ["Dance Pop", "R&B"],
      releaseYear: 1983,
      youtubeUrl: "https://www.youtube.com/watch?v=Zi_XLOBDo_Y",
      youtubeVideoId: "Zi_XLOBDo_Y",
      spotifyUrl: "https://open.spotify.com/track/5ChkMS8OtdzJeqyybCc9R5",
      lyrics: [
        { time: 0, text: "She was more like a beauty queen", translation: "" },
        { time: 4, text: "From a movie scene", translation: "" },
        { time: 7, text: "I said don't mind, but what do you mean", translation: "" },
        { time: 11, text: "I am the one", translation: "" },
        { time: 14, text: "Who will dance on the floor", translation: "" },
        { time: 17, text: "In the round", translation: "" }
      ],
      mood: "Energetic",
      energy: 0.9,
      danceability: 0.95,
      valence: 0.6,
      tempo: 117,
      key: "F# minor",
      tags: ["dance", "pop", "80s", "iconic", "thriller"],
      playCount: 1500000,
      likes: 125000,
      isExplicit: false,
      language: "English",
      country: "USA"
    },
    {
      id: "4",
      title: "Hotel California",
      shortDescription: "Mysterious rock epic about excess and the American Dream",
      artists: ["Eagles"],
      primaryArtist: "Eagles",
      album: "Hotel California",
      albumArt: "https://upload.wikimedia.org/wikipedia/en/4/49/Hotelcalifornia.jpg",
      duration: 391, // 6:31
      genre: "Rock",
      subGenres: ["Classic Rock", "Country Rock"],
      releaseYear: 1976,
      youtubeUrl: "https://www.youtube.com/watch?v=09839DpTctU",
      youtubeVideoId: "09839DpTctU",
      spotifyUrl: "https://open.spotify.com/track/40riOy7x9W7GXjyGp4pjAv",
      lyrics: [
        { time: 0, text: "On a dark desert highway", translation: "" },
        { time: 4, text: "Cool wind in my hair", translation: "" },
        { time: 8, text: "Warm smell of colitas", translation: "" },
        { time: 12, text: "Rising up through the air", translation: "" },
        { time: 16, text: "Up ahead in the distance", translation: "" },
        { time: 20, text: "I saw a shimmering light", translation: "" }
      ],
      mood: "Mysterious",
      energy: 0.7,
      danceability: 0.5,
      valence: 0.4,
      tempo: 75,
      key: "B minor",
      tags: ["classic rock", "guitar solo", "70s", "mysterious", "epic"],
      playCount: 1100000,
      likes: 95000,
      isExplicit: false,
      language: "English",
      country: "USA"
    },
    {
      id: "5",
      title: "Smells Like Teen Spirit",
      shortDescription: "Grunge anthem that defined a generation and alternative rock",
      artists: ["Nirvana"],
      primaryArtist: "Nirvana",
      album: "Nevermind",
      albumArt: "https://upload.wikimedia.org/wikipedia/en/b/b7/NirvanaNevermindalbumcover.jpg",
      duration: 301, // 5:01
      genre: "Grunge",
      subGenres: ["Alternative Rock", "Punk Rock"],
      releaseYear: 1991,
      youtubeUrl: "https://www.youtube.com/watch?v=hTWKbfoikeg",
      youtubeVideoId: "hTWKbfoikeg",
      spotifyUrl: "https://open.spotify.com/track/4CeeEOM32jQcH3eN9Q2dGj",
      lyrics: [
        { time: 0, text: "Load up on guns", translation: "" },
        { time: 3, text: "Bring your friends", translation: "" },
        { time: 6, text: "It's fun to lose and to pretend", translation: "" },
        { time: 12, text: "She's over-bored and self-assured", translation: "" },
        { time: 18, text: "Oh no, I know a dirty word", translation: "" }
      ],
      mood: "Rebellious",
      energy: 0.95,
      danceability: 0.7,
      valence: 0.3,
      tempo: 117,
      key: "F major",
      tags: ["grunge", "90s", "alternative", "rebellious", "iconic"],
      playCount: 850000,
      likes: 68000,
      isExplicit: false,
      language: "English",
      country: "USA"
    }
  ],

  playlists: [
    {
      id: "playlist-1",
      name: "Classic Rock Legends",
      description: "Timeless rock anthems that defined generations",
      coverImage: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500",
      songIds: ["1", "4"],
      createdBy: "Music Curator",
      createdAt: "2024-01-15",
      isPublic: true,
      followers: 15420,
      totalDuration: 746, // sum of song durations
      mood: "Energetic",
      tags: ["rock", "classic", "legends"]
    },
    {
      id: "playlist-2",
      name: "Peaceful Moments",
      description: "Calm and soothing tracks for relaxation",
      coverImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
      songIds: ["2"],
      createdBy: "Zen Master",
      createdAt: "2024-01-20",
      isPublic: true,
      followers: 8930,
      totalDuration: 183,
      mood: "Calm",
      tags: ["peaceful", "relaxing", "meditation"]
    }
  ],

  artists: [
    {
      id: "artist-1",
      name: "Queen",
      bio: "British rock band formed in London in 1970, known for their theatrical performances and diverse musical style.",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500",
      genres: ["Rock", "Progressive Rock", "Opera Rock"],
      country: "United Kingdom",
      formed: 1970,
      members: ["Freddie Mercury", "Brian May", "Roger Taylor", "John Deacon"],
      monthlyListeners: 45000000,
      verified: true,
      socialLinks: {
        website: "https://www.queenonline.com/",
        instagram: "@officialqueenmusic",
        twitter: "@QueenWillRock"
      }
    },
    {
      id: "artist-2",
      name: "John Lennon",
      bio: "English singer, songwriter, and peace activist who gained worldwide fame as a founder of The Beatles.",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500",
      genres: ["Pop", "Rock", "Folk"],
      country: "United Kingdom",
      formed: 1940,
      monthlyListeners: 25000000,
      verified: true,
      socialLinks: {
        website: "https://www.johnlennon.com/"
      }
    }
  ],

  albums: [
    {
      id: "album-1",
      title: "A Night at the Opera",
      artist: "Queen",
      artistId: "artist-1",
      releaseDate: "1975-11-21",
      coverArt: "https://upload.wikimedia.org/wikipedia/en/4/4d/Queen_A_Night_at_the_Opera.png",
      totalTracks: 12,
      duration: 2562, // total album duration in seconds
      genre: "Rock",
      label: "EMI",
      songIds: ["1"],
      description: "Queen's fourth studio album, featuring their most ambitious compositions including the epic 'Bohemian Rhapsody'."
    }
  ]
};

// Helper functions for data manipulation
export const getMusicData = () => musicDatabase;

export const getSongById = (id) => {
  return musicDatabase.songs.find(song => song.id === id);
};

export const getPlaylistById = (id) => {
  return musicDatabase.playlists.find(playlist => playlist.id === id);
};

export const getArtistById = (id) => {
  return musicDatabase.artists.find(artist => artist.id === id);
};

export const getSongsByArtist = (artistName) => {
  return musicDatabase.songs.filter(song => 
    song.artists.includes(artistName) || song.primaryArtist === artistName
  );
};

export const getSongsByGenre = (genre) => {
  return musicDatabase.songs.filter(song => 
    song.genre === genre || song.subGenres.includes(genre)
  );
};

export const searchSongs = (query) => {
  const lowercaseQuery = query.toLowerCase();
  return musicDatabase.songs.filter(song =>
    song.title.toLowerCase().includes(lowercaseQuery) ||
    song.artists.some(artist => artist.toLowerCase().includes(lowercaseQuery)) ||
    song.album.toLowerCase().includes(lowercaseQuery) ||
    song.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};

export const getRecommendedSongs = (basedOnSong, limit = 5) => {
  if (!basedOnSong) return musicDatabase.songs.slice(0, limit);
  
  const sameMood = musicDatabase.songs.filter(song => 
    song.id !== basedOnSong.id && song.mood === basedOnSong.mood
  );
  
  const sameGenre = musicDatabase.songs.filter(song => 
    song.id !== basedOnSong.id && song.genre === basedOnSong.genre
  );
  
  const combined = [...sameMood, ...sameGenre];
  const unique = combined.filter((song, index, self) => 
    index === self.findIndex(s => s.id === song.id)
  );
  
  return unique.slice(0, limit);
};

export default musicDatabase;
