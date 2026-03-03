import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Shield, Mail, Lock, User, ArrowRight, Github, Chrome } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import { toast } from 'sonner';

export default function Auth() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register Form State
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!loginEmail || !loginPassword) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    if (!loginEmail.includes('@')) {
      toast.error('Adresse email invalide');
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Connexion réussie !');
      navigate('/dashboard');
    }, 1500);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!registerName || !registerEmail || !registerPassword || !registerConfirmPassword) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    if (!registerEmail.includes('@')) {
      toast.error('Adresse email invalide');
      return;
    }

    if (registerPassword.length < 8) {
      toast.error('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    if (registerPassword !== registerConfirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Compte créé avec succès !');
      navigate('/dashboard');
    }, 1500);
  };

  const handleSocialLogin = (provider: string) => {
    toast.info(`Connexion avec ${provider} en cours...`);
    setTimeout(() => {
      navigate('/dashboard');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">SecureScan</h1>
          <p className="text-gray-400">Plateforme de Sécurité & Analyse de Code</p>
        </div>

        {/* Auth Card */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white text-center">Bienvenue</CardTitle>
            <CardDescription className="text-gray-400 text-center">
              Connectez-vous ou créez un compte pour continuer
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-gray-800">
                <TabsTrigger value="login" className="data-[state=active]:bg-blue-600">
                  Connexion
                </TabsTrigger>
                <TabsTrigger value="register" className="data-[state=active]:bg-blue-600">
                  Inscription
                </TabsTrigger>
              </TabsList>

              {/* Login Tab */}
              <TabsContent value="login" className="space-y-4 mt-6">
                <form onSubmit={handleLogin} className="space-y-4">
                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="text-gray-300">
                      Adresse email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="exemple@email.com"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="pl-11 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                        required
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="login-password" className="text-gray-300">
                        Mot de passe
                      </Label>
                      <button
                        type="button"
                        className="text-xs text-blue-400 hover:text-blue-300"
                        onClick={() => toast.info('Fonctionnalité bientôt disponible')}
                      >
                        Mot de passe oublié ?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="••••••••"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="pl-11 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                        required
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white h-11"
                  >
                    {isLoading ? (
                      'Connexion en cours...'
                    ) : (
                      <>
                        Se connecter
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </form>

                {/* Divider */}
                <div className="relative my-6">
                  <Separator className="bg-gray-800" />
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-900 px-3 text-xs text-gray-500">
                    OU
                  </span>
                </div>

                {/* Social Login */}
                <div className="space-y-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                    onClick={() => handleSocialLogin('GitHub')}
                  >
                    <Github className="w-5 h-5 mr-2" />
                    Continuer avec GitHub
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                    onClick={() => handleSocialLogin('Google')}
                  >
                    <Chrome className="w-5 h-5 mr-2" />
                    Continuer avec Google
                  </Button>
                </div>
              </TabsContent>

              {/* Register Tab */}
              <TabsContent value="register" className="space-y-4 mt-6">
                <form onSubmit={handleRegister} className="space-y-4">
                  {/* Name */}
                  <div className="space-y-2">
                    <Label htmlFor="register-name" className="text-gray-300">
                      Nom complet
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <Input
                        id="register-name"
                        type="text"
                        placeholder="Jean Dupont"
                        value={registerName}
                        onChange={(e) => setRegisterName(e.target.value)}
                        className="pl-11 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                        required
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="register-email" className="text-gray-300">
                      Adresse email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="exemple@email.com"
                        value={registerEmail}
                        onChange={(e) => setRegisterEmail(e.target.value)}
                        className="pl-11 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                        required
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <Label htmlFor="register-password" className="text-gray-300">
                      Mot de passe
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <Input
                        id="register-password"
                        type="password"
                        placeholder="••••••••"
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        className="pl-11 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                        required
                        minLength={8}
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      Minimum 8 caractères
                    </p>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <Label htmlFor="register-confirm-password" className="text-gray-300">
                      Confirmer le mot de passe
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <Input
                        id="register-confirm-password"
                        type="password"
                        placeholder="••••••••"
                        value={registerConfirmPassword}
                        onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                        className="pl-11 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                        required
                      />
                    </div>
                  </div>

                  {/* Terms */}
                  <div className="text-xs text-gray-500">
                    En créant un compte, vous acceptez nos{' '}
                    <button
                      type="button"
                      className="text-blue-400 hover:text-blue-300"
                      onClick={() => toast.info('Conditions d\'utilisation')}
                    >
                      Conditions d'utilisation
                    </button>{' '}
                    et notre{' '}
                    <button
                      type="button"
                      className="text-blue-400 hover:text-blue-300"
                      onClick={() => toast.info('Politique de confidentialité')}
                    >
                      Politique de confidentialité
                    </button>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white h-11"
                  >
                    {isLoading ? (
                      'Création du compte...'
                    ) : (
                      <>
                        Créer mon compte
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </form>

                {/* Divider */}
                <div className="relative my-6">
                  <Separator className="bg-gray-800" />
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-900 px-3 text-xs text-gray-500">
                    OU
                  </span>
                </div>

                {/* Social Register */}
                <div className="space-y-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                    onClick={() => handleSocialLogin('GitHub')}
                  >
                    <Github className="w-5 h-5 mr-2" />
                    S'inscrire avec GitHub
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                    onClick={() => handleSocialLogin('Google')}
                  >
                    <Chrome className="w-5 h-5 mr-2" />
                    S'inscrire avec Google
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Hackathon CyberSécurité 2026 - SecureScan v1.0.0
          </p>
        </div>
      </div>
    </div>
  );
}
