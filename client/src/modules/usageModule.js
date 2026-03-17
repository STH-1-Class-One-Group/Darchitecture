const usageLogStore = [];

export function logUsage(userId, action) {
  if (!action) return;
  usageLogStore.unshift({
    id: `usage_${Date.now()}`,
    userId: userId || 'guest',
    action,
    loggedAt: new Date().toISOString(),
  });
}

export function getUsageLogs() {
  return usageLogStore;
}
