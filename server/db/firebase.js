const db = {
  users: new Map(),
  rides: new Map(),
  reports: new Map(),
  pointLogs: [],
  quizResults: [],
  usageLogs: [],
};

function generateId(prefix) {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
}

function getOrCreateUser(userId, profile = {}) {
  if (db.users.has(userId)) return db.users.get(userId);
  const user = {
    id: userId,
    profile: {
      name: profile.name || '대전 시민',
      email: profile.email || 'guest@tashu.local',
    },
    region: profile.region || 'visitor',
    pointBalance: 0,
  };
  db.users.set(userId, user);
  return user;
}

module.exports = {
  db,
  generateId,
  getOrCreateUser,
};
