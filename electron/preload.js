const { contextBridge, ipcRenderer } = require('electron');

console.log('[Preload] Script loading...');

try {
  const path = require('path');
  const backupDir = path.join(process.env.APPDATA || path.join(process.env.USERPROFILE, 'AppData\Roaming'), 'hosts-manager', 'backups');
  
  // 添加IPC调用调试拦截器
  function debugIPC(method, ...args) {
    console.log(`[IPC Debug] ${method} called with args:`, args);
    try {
      JSON.stringify(args);
      console.log(`[IPC Debug] ${method} args are serializable`);
    } catch (error) {
      console.error(`[IPC Debug] ${method} args are NOT serializable:`, error);
    }
    return ipcRenderer.invoke(method, ...args);
  }
  
  window.electronAPI = {
    backupDir: backupDir,
    isServiceReady: () => debugIPC('is-service-ready'),
    getHosts: () => debugIPC('get-hosts'),
    addHost: (host) => debugIPC('add-host', host),
    updateHost: (oldHost, newHost) => debugIPC('update-host', oldHost, newHost),
    deleteHost: (host) => debugIPC('delete-host', host),
    deleteHosts: (hosts) => debugIPC('delete-hosts', hosts),
    createBackup: () => debugIPC('create-backup'),
    restoreBackup: (backupPath) => debugIPC('restore-backup', backupPath),
    getBackups: () => debugIPC('get-backups'),
    undo: () => debugIPC('undo'),
    redo: () => debugIPC('redo'),
    canUndo: () => debugIPC('can-undo'),
    canRedo: () => debugIPC('can-redo'),
    openHostsFile: () => debugIPC('open-hosts-file'),
    showFolder: (folderPath) => debugIPC('show-folder', folderPath),
    validateIP: (ip) => debugIPC('validate-ip', ip),
    validateDomain: (domain) => debugIPC('validate-domain', domain),
    confirmDialog: (options) => debugIPC('confirm-dialog', options),
    showMessage: (options) => debugIPC('show-message', options)
  };

  console.log('[Preload] API exposed directly with IPC debugging');
} catch (error) {
  console.error('[Preload] Error:', error);
}
