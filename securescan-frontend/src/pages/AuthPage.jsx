import { useState } from 'react';
import { loginUser, registerUser } from '../api/auth';
import { Lock, Mail, User } from 'lucide-react';

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                const data = await loginUser(formData.email, formData.password);
                console.log("Succès Login :", data);
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                alert('Connexion réussie ! Redirection vers le Dashboard...');
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
        <div style={{ maxWidth: '400px', margin: '50px auto', fontFamily: 'sans-serif' }}>
            <h2>{isLogin ? 'Connexion à SecureScan' : 'Créer un compte'}</h2>
            
            {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {!isLogin && (
                    <div>
                        <label><User size={16}/> Nom complet</label>
                        <input 
                            type="text" name="name" required={!isLogin}
                            value={formData.name} onChange={handleChange}
                            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                        />
                    </div>
                )}
                
                <div>
                    <label><Mail size={16}/> Email</label>
                    <input 
                        type="email" name="email" required
                        value={formData.email} onChange={handleChange}
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                </div>

                <div>
                    <label><Lock size={16}/> Mot de passe</label>
                    <input 
                        type="password" name="password" required
                        value={formData.password} onChange={handleChange}
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                </div>

                <button type="submit" disabled={loading} style={{ padding: '10px', background: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}>
                    {loading ? 'Chargement...' : (isLogin ? 'Se connecter' : 'S\'inscrire')}
                </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: '15px' }}>
                {isLogin ? "Pas encore de compte ? " : "Déjà un compte ? "}
                <button 
                    onClick={() => { setIsLogin(!isLogin); setError(''); }}
                    style={{ background: 'none', border: 'none', color: '#007bff', textDecoration: 'underline', cursor: 'pointer' }}
                >
                    {isLogin ? "S'inscrire" : "Se connecter"}
                </button>
            </p>
        </div>
    );
}