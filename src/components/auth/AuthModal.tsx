import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { Mail, Loader2, Shield } from 'lucide-react'
import { CodeOfConductModal } from './CodeOfConductModal'
import { Logo } from '@/components/ui/logo'


interface AuthModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const AuthModal = ({ open, onOpenChange }: AuthModalProps) => {
  const [psuId, setPsuId] = useState('')
  const [fullName, setFullName] = useState('')
  const [agreedToRules, setAgreedToRules] = useState(false)
  const [loading, setLoading] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState('')
  const { toast } = useToast()

  const fullEmail = psuId ? `${psuId}@psu.edu` : ''

  const validatePSUId = (id: string) => {
    return id.length > 0 && /^[a-zA-Z0-9]+$/.test(id)
  }

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validatePSUId(psuId)) {
      toast({
        title: 'Error',
        description: 'Please enter a valid PSU ID',
        variant: 'destructive'
      })
      return
    }

    if (!fullName.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter your full name',
        variant: 'destructive'
      })
      return
    }

    if (!agreedToRules) {
      toast({
        title: 'Error',
        description: 'Please agree to the rules and code of conduct',
        variant: 'destructive'
      })
      return
    }

    setLoading(true)

    try {
      // Send OTP code only
      const { error } = await supabase.auth.signInWithOtp({
        email: fullEmail.toLowerCase(),
        options: {
          data: {
            full_name: fullName.trim(),
            email: fullEmail.toLowerCase()
          },
          shouldCreateUser: true,
          emailRedirectTo: undefined // Explicitly disable redirect to force OTP
        }
      })

      if (error) throw error

      setOtpSent(true)
      toast({
        title: 'Check your email!',
        description: `We sent you a verification code to ${fullEmail}. Your account will be created after you verify your email.`,
      })
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to send verification code',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!otp || otp.length < 4) {
      toast({
        title: 'Error',
        description: 'Please enter the verification code',
        variant: 'destructive'
      })
      return
    }

    setLoading(true)

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: fullEmail.toLowerCase(),
        token: otp,
        type: 'email'
      })

      if (error) throw error

      toast({
        title: 'Welcome!',
        description: 'Your account has been created and you are now signed in.',
      })
      onOpenChange(false)
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Invalid verification code',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Logo size="md" />
          </div>
          <DialogTitle className="text-gradient-cyber text-center">Join Decrypt Night</DialogTitle>
          <DialogDescription className="text-center">
            Open your account with your PSU ID to start competing
          </DialogDescription>
        </DialogHeader>

        <Card className="card-cyber">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl">
              {otpSent ? 'Enter Verification Code' : 'Open Account'}
            </CardTitle>
            <CardDescription>
              {otpSent
                ? 'Check your email for the verification code. Your account will be created after verification.'
                : 'Enter your details to get started. Your account will be created after email verification.'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="psuId">PSU ID</Label>
                  <div className="flex">
                    <Input
                      id="psuId"
                      value={psuId}
                      onChange={(e) => setPsuId(e.target.value.replace(/[^a-zA-Z0-9]/g, ''))}
                      placeholder="abc123"
                      className="rounded-r-none border-r-0"
                      required
                    />
                    <div className="px-3 py-2 bg-muted border border-l-0 rounded-r-md flex items-center text-muted-foreground">
                      @psu.edu
                    </div>
                  </div>
                  {psuId && (
                    <p className="text-sm text-muted-foreground">
                      Verification code will be sent to: <span className="text-primary font-medium">{fullEmail}</span>
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="rules"
                    checked={agreedToRules}
                    onCheckedChange={(checked) => setAgreedToRules(checked as boolean)}
                  />
                  <Label
                    htmlFor="rules"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I agree to the rules and{' '}
                    <CodeOfConductModal>
                      <button
                        type="button"
                        className="text-primary hover:text-primary/80 underline"
                      >
                        code of conduct
                      </button>
                    </CodeOfConductModal>
                  </Label>
                </div>

                <Button type="submit" className="w-full btn-neon" disabled={loading || !psuId || !fullName || !agreedToRules}>
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending code...
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4 mr-2" />
                      Send Verification Code
                    </>
                  )}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp">Verification Code</Label>
                  <Input
                    id="otp"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/[^0-9a-zA-Z]/g, ''))}
                    placeholder="Enter code from email"
                    className="text-center text-lg tracking-widest"
                    required
                  />
                  <p className="text-sm text-muted-foreground text-center">
                    Enter the code sent to <span className="text-primary font-medium">{fullEmail}</span>
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setOtpSent(false)
                      setOtp('')
                    }}
                    disabled={loading}
                  >
                    Back
                  </Button>
                  <Button type="submit" className="flex-1 btn-neon" disabled={loading || !otp}>
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      'Verify & Sign In'
                    )}
                  </Button>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  className="w-full text-sm"
                  onClick={() => handleSendOtp(new Event('submit') as any)}
                  disabled={loading}
                >
                  Didn't receive the code? Send again
                </Button>
              </form>
            )}
          </CardContent>
        </Card>


        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Shield className="w-3 h-3" />
          <span>We use verification codes for secure, passwordless authentication</span>
        </div>
      </DialogContent>
    </Dialog>
  )
}