'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Settings, Bell, Lock, Palette } from 'lucide-react';

export function SettingsManagement() {
  const [settings, setSettings] = useState({
    systemName: 'Kabaza Registration System',
    organizationName: 'Kabaza',
    email: 'admin@kabaza.com',
    phone: '+265888111111',
    address: 'Lilongwe, Malawi',
    currency: 'MWK',
    timezone: 'Africa/Johannesburg',
    maxLoginAttempts: 5,
    sessionTimeout: 30,
    enableNotifications: true,
    enableApiAccess: true,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedSettings, setEditedSettings] = useState(settings);

  const handleSave = () => {
    setSettings(editedSettings);
    setIsEditing(false);
    alert('Settings saved successfully!');
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">System Settings</h2>
        <p className="text-gray-600">Configure system-wide settings and preferences</p>
      </div>

      {/* Organization Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette size={20} />
            Organization Information
          </CardTitle>
          <CardDescription>Basic system and organization details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isEditing ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="systemName">System Name</Label>
                  <Input
                    id="systemName"
                    value={editedSettings.systemName}
                    onChange={(e) => setEditedSettings({ ...editedSettings, systemName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="organizationName">Organization Name</Label>
                  <Input
                    id="organizationName"
                    value={editedSettings.organizationName}
                    onChange={(e) => setEditedSettings({ ...editedSettings, organizationName: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={editedSettings.email}
                    onChange={(e) => setEditedSettings({ ...editedSettings, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={editedSettings.phone}
                    onChange={(e) => setEditedSettings({ ...editedSettings, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={editedSettings.address}
                  onChange={(e) => setEditedSettings({ ...editedSettings, address: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Input
                    id="currency"
                    value={editedSettings.currency}
                    onChange={(e) => setEditedSettings({ ...editedSettings, currency: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Input
                    id="timezone"
                    value={editedSettings.timezone}
                    onChange={(e) => setEditedSettings({ ...editedSettings, timezone: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSave} variant="default">
                  Save Changes
                </Button>
                <Button onClick={() => setIsEditing(false)} variant="outline">
                  Cancel
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600">System Name</p>
                  <p className="font-semibold">{settings.systemName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Organization</p>
                  <p className="font-semibold">{settings.organizationName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-semibold">{settings.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-semibold">{settings.phone}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-600">Address</p>
                  <p className="font-semibold">{settings.address}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Currency</p>
                  <p className="font-semibold">{settings.currency}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Timezone</p>
                  <p className="font-semibold">{settings.timezone}</p>
                </div>
              </div>
              <Button onClick={() => setIsEditing(true)} variant="outline">
                Edit Settings
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock size={20} />
            Security Settings
          </CardTitle>
          <CardDescription>Configure security and access control</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-6">
            <div className="border-l-4 border-blue-600 pl-4">
              <p className="text-sm text-gray-600">Max Login Attempts</p>
              <p className="text-2xl font-bold">{settings.maxLoginAttempts}</p>
              <p className="text-xs text-gray-500">Failed attempts before lockout</p>
            </div>
            <div className="border-l-4 border-green-600 pl-4">
              <p className="text-sm text-gray-600">Session Timeout</p>
              <p className="text-2xl font-bold">{settings.sessionTimeout} min</p>
              <p className="text-xs text-gray-500">Minutes before auto-logout</p>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-4">
            <p className="text-sm font-semibold text-gray-900 mb-3">Last Security Audit</p>
            <p className="text-sm text-gray-600">April 20, 2024</p>
            <Button variant="outline" className="mt-3">
              Run Security Check
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell size={20} />
            Notification Settings
          </CardTitle>
          <CardDescription>Configure system notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enableNotifications}
                onChange={(e) => setEditedSettings({ ...editedSettings, enableNotifications: e.target.checked })}
                className="rounded border-gray-300 w-4 h-4"
              />
              <div>
                <p className="font-semibold text-gray-900">Enable Notifications</p>
                <p className="text-sm text-gray-600">Receive system alerts and updates</p>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enableApiAccess}
                onChange={(e) => setEditedSettings({ ...editedSettings, enableApiAccess: e.target.checked })}
                className="rounded border-gray-300 w-4 h-4"
              />
              <div>
                <p className="font-semibold text-gray-900">Enable API Access</p>
                <p className="text-sm text-gray-600">Allow external systems to access the API</p>
              </div>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* System Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings size={20} />
            System Information
          </CardTitle>
          <CardDescription>System version and status information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-600">System Version</p>
              <p className="font-semibold text-lg">v2.0.0</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Build Date</p>
              <p className="font-semibold text-lg">April 27, 2024</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Database Status</p>
              <p className="font-semibold text-lg text-green-600">Connected</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">API Status</p>
              <p className="font-semibold text-lg text-green-600">Active</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="font-semibold text-lg">3</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Uptime</p>
              <p className="font-semibold text-lg">45 days</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
