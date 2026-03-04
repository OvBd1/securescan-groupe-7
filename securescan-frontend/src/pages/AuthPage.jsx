import { useState } from 'react';
import { loginUser, registerUser } from '../api/auth';
import { Shield, Mail, Lock, User, ArrowRight, Github, Chrome } from 'lucide-react';

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!isLogin && formData.password !== formData.confirmPassword) {
            return setError('Les mots de passe ne correspondent pas.');
        }

        setLoading(true);

        try {
            if (isLogin) {
                const data = await loginUser(formData.email, formData.password);
                
                if (data.token) {
                    localStorage.setItem('token', data.token);
                }
                if (data.user) {
                    localStorage.setItem('user', JSON.stringify(data.user));
                } 
                else if (data.id) {
                    const userObj = { id: data.id, email: data.email, name: data.name };
                    localStorage.setItem('user', JSON.stringify(userObj));
                } else {
                    console.warn("L'objet utilisateur n'a pas été trouvé dans la réponse :", data);
                    localStorage.setItem('user', JSON.stringify(data)); 
                }

                window.location.href = '/dashboard';
            } else {
                await registerUser(formData.name, formData.email, formData.password);
                alert('Inscription réussie ! Tu peux maintenant te connecter.');
                setIsLogin(true);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#0b0f19] text-white font-sans p-4">
            <div className="flex flex-col items-center mb-8">
                <div className="bg-[#1a85ff] p-4 rounded-3xl mb-4 shadow-lg shadow-blue-500/20">
                    <Shield size={32} className="text-white" fill="currentColor" />
                </div>
                <h1 className="text-3xl font-bold tracking-wide">SecureScan</h1>
                <p className="text-gray-400 mt-2 text-sm">Plateforme de Sécurité & Analyse de Code</p>
            </div>

            <div className="bg-[#111623] border border-gray-800 rounded-2xl w-full max-w-[440px] p-8 shadow-2xl">
                
                <div className="text-center mb-6">
                    <h2 className="text-lg font-semibold mb-1">Bienvenue</h2>
                    <p className="text-gray-400 text-sm">Connectez-vous ou créez un compte pour continuer</p>
                </div>

                <div className="flex bg-[#1a2133] rounded-xl p-1 mb-6">
                    <button 
                        type="button"
                        onClick={() => { setIsLogin(true); setError(''); }}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${isLogin ? 'bg-blue-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                    >
                        Connexion
                    </button>
                    <button 
                        type="button"
                        onClick={() => { setIsLogin(false); setError(''); }}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${!isLogin ? 'bg-blue-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                    >
                        Inscription
                    </button>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    
                    {!isLogin && (
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1.5">Nom complet</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User size={18} className="text-gray-500" />
                                </div>
                                <input 
                                    type="text" name="name" required={!isLogin}
                                    value={formData.name} onChange={handleChange}
                                    placeholder="Jean Dupont"
                                    className="w-full bg-[#1a2133] border border-gray-700/50 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                                />
                            </div>
                        </div>
                    )}
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5">Adresse email</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail size={18} className="text-gray-500" />
                            </div>
                            <input 
                                type="email" name="email" required
                                value={formData.email} onChange={handleChange}
                                placeholder="exemple@email.com"
                                className="w-full bg-[#1a2133] border border-gray-700/50 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-1.5">
                            <label className="text-sm font-medium text-gray-300">Mot de passe</label>
                            {isLogin && (
                                <a href="#" className="text-xs text-blue-500 hover:text-blue-400 hover:underline">Mot de passe oublié ?</a>
                            )}
                        </div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock size={18} className="text-gray-500" />
                            </div>
                            <input 
                                type="password" name="password" required
                                value={formData.password} onChange={handleChange}
                                placeholder="••••••••"
                                className="w-full bg-[#1a2133] border border-gray-700/50 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                            />
                        </div>
                        {!isLogin && <p className="text-[11px] text-gray-500 mt-1.5">Minimum 8 caractères</p>}
                    </div>

                    {!isLogin && (
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1.5 mt-2">Confirmer le mot de passe</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock size={18} className="text-gray-500" />
                                </div>
                                <input 
                                    type="password" name="confirmPassword" required={!isLogin}
                                    value={formData.confirmPassword} onChange={handleChange}
                                    placeholder="••••••••"
                                    className="w-full bg-[#1a2133] border border-gray-700/50 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                                />
                            </div>
                        </div>
                    )}

                    {!isLogin && (
                        <p className="text-xs text-gray-400 mt-4 leading-relaxed">
                            En créant un compte, vous acceptez nos <a href="#" className="text-blue-500 hover:underline">Conditions d'utilisation</a> et notre <a href="#" className="text-blue-500 hover:underline">Politique de confidentialité</a>
                        </p>
                    )}

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full mt-2 bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition duration-200 disabled:opacity-50"
                    >
                        {loading ? 'Chargement...' : (isLogin ? 'Se connecter' : 'Créer mon compte')}
                        {!loading && <ArrowRight size={18} />}
                    </button>
                </form>
            </div>
            
            <p className="text-[#4b5563] text-xs mt-8">
                Hackathon CyberSécurité 2026 - SecureScan v1.0.0
            </p>
        </div>
    );
}