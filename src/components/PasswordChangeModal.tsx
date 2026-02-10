import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguageContext } from '@/lib/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Eye, 
  EyeOff, 
  Lock, 
  Loader2,
  AlertCircle,
  CheckCircle,
  Shield,
  Key
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { UserManagementAPI, PasswordChangeRequest } from '@/lib/user-management-api';

interface PasswordChangeModalProps {
  userEmail: string;
  onPasswordChanged: (dashboardUrl: string) => void;
  onCancel?: () => void;
}

export default function PasswordChangeModal({ userEmail, onPasswordChanged, onCancel }: PasswordChangeModalProps) {
  const { t } = useLanguageContext();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Password strength validation
  const validatePassword = (password: string) => {
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };

    const score = Object.values(requirements).filter(Boolean).length;
    return { requirements, score, isValid: score >= 4 };
  };

  const passwordValidation = validatePassword(formData.newPassword);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    // Validation
    if (!formData.currentPassword) {
      setError('Please enter your current password');
      setIsLoading(false);
      return;
    }

    if (!passwordValidation.isValid) {
      setError('New password must meet security requirements');
      setIsLoading(false);
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      setIsLoading(false);
      return;
    }

    if (formData.currentPassword === formData.newPassword) {
      setError('New password must be different from current password');
      setIsLoading(false);
      return;
    }

    try {
      const request: PasswordChangeRequest = {
        email: userEmail,
        oldPassword: formData.currentPassword,
        newPassword: formData.newPassword
      };

      const response = await UserManagementAPI.changePassword(request);

      if (response.success) {
        setSuccess('Password changed successfully! Redirecting to dashboard...');
        
        // Store success message and redirect
        setTimeout(() => {
          onPasswordChanged(response.dashboardUrl || '/dashboard');
        }, 2000);
      } else {
        setError(response.error || 'Failed to change password');
      }
    } catch (error) {
      console.error('Password change error:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <Card className="cyber-card border-electric-500/30">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-electric-500/20 to-neon-purple/20 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-electric-400" />
            </div>
            <CardTitle className="text-2xl font-cyber gradient-text">
              Password Change Required
            </CardTitle>
            <CardDescription className="text-electric-300">
              For security reasons, you must change your password before accessing the system.
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Current Password */}
              <div className="space-y-2">
                <Label htmlFor="current-password" className="text-electric-300 font-modern">
                  Current Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-electric-400" />
                  <Input
                    id="current-password"
                    type={showCurrentPassword ? "text" : "password"}
                    placeholder="Enter current password"
                    value={formData.currentPassword}
                    onChange={(e) => setFormData({...formData, currentPassword: e.target.value})}
                    className="pl-10 pr-10 bg-deep-blue/50 border-electric-500/30 text-white"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-3 text-electric-400 hover:text-electric-300"
                  >
                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-2">
                <Label htmlFor="new-password" className="text-electric-300 font-modern">
                  New Password
                </Label>
                <div className="relative">
                  <Key className="absolute left-3 top-3 h-4 w-4 text-electric-400" />
                  <Input
                    id="new-password"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={formData.newPassword}
                    onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                    className="pl-10 pr-10 bg-deep-blue/50 border-electric-500/30 text-white"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-3 text-electric-400 hover:text-electric-300"
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                {/* Password Requirements */}
                {formData.newPassword && (
                  <div className="mt-2 p-3 bg-deep-blue/30 rounded-lg border border-electric-500/20">
                    <p className="text-sm text-electric-300 mb-2">Password Requirements:</p>
                    <div className="space-y-1 text-xs">
                      <div className={`flex items-center gap-2 ${passwordValidation.requirements.length ? 'text-green-400' : 'text-gray-400'}`}>
                        <CheckCircle className="w-3 h-3" />
                        At least 8 characters
                      </div>
                      <div className={`flex items-center gap-2 ${passwordValidation.requirements.uppercase ? 'text-green-400' : 'text-gray-400'}`}>
                        <CheckCircle className="w-3 h-3" />
                        One uppercase letter
                      </div>
                      <div className={`flex items-center gap-2 ${passwordValidation.requirements.lowercase ? 'text-green-400' : 'text-gray-400'}`}>
                        <CheckCircle className="w-3 h-3" />
                        One lowercase letter
                      </div>
                      <div className={`flex items-center gap-2 ${passwordValidation.requirements.number ? 'text-green-400' : 'text-gray-400'}`}>
                        <CheckCircle className="w-3 h-3" />
                        One number
                      </div>
                      <div className={`flex items-center gap-2 ${passwordValidation.requirements.special ? 'text-green-400' : 'text-gray-400'}`}>
                        <CheckCircle className="w-3 h-3" />
                        One special character
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-600 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${
                              passwordValidation.score <= 2 ? 'bg-red-500' :
                              passwordValidation.score <= 3 ? 'bg-yellow-500' :
                              'bg-green-500'
                            }`}
                            style={{ width: `${(passwordValidation.score / 5) * 100}%` }}
                          />
                        </div>
                        <span className={`text-xs ${
                          passwordValidation.score <= 2 ? 'text-red-400' :
                          passwordValidation.score <= 3 ? 'text-yellow-400' :
                          'text-green-400'
                        }`}>
                          {passwordValidation.score <= 2 ? 'Weak' :
                           passwordValidation.score <= 3 ? 'Medium' :
                           'Strong'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-electric-300 font-modern">
                  Confirm New Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-electric-400" />
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    className="pl-10 pr-10 bg-deep-blue/50 border-electric-500/30 text-white"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-electric-400 hover:text-electric-300"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
                  <p className="text-red-400 text-sm">Passwords do not match</p>
                )}
              </div>

              {error && (
                <Alert className="border-red-500/50 bg-red-500/10">
                  <AlertCircle className="h-4 w-4 text-red-400" />
                  <AlertDescription className="text-red-300">{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="border-green-500/50 bg-green-500/10">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <AlertDescription className="text-green-300">{success}</AlertDescription>
                </Alert>
              )}

              <div className="flex gap-3 pt-4">
                <Button 
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  className="flex-1 border-electric-500/30 text-electric-300 hover:bg-electric-500/10"
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 btn-holographic"
                  disabled={isLoading || !passwordValidation.isValid || formData.newPassword !== formData.confirmPassword}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Shield className="mr-2 h-4 w-4" />
                      Change Password
                    </>
                  )}
                </Button>
              </div>
            </form>

            {/* Security Notice */}
            <div className="mt-6 p-3 bg-electric-500/10 rounded-lg border border-electric-500/20">
              <p className="text-xs text-electric-300 text-center">
                🔒 Your password will be encrypted and stored securely. 
                This change is required for your account security.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}