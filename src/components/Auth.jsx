import React, { useState } from 'react';
import { User, Loader2 } from 'lucide-react';

const Auth = ({ supabase }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  // Nustatomas limitas, kad atitiktų Jūsų UI pranešimą
  const INITIAL_QUOTA = 20; 

  // --- Prisijungimo/Registracijos Funkcija (naudojant Slaptažodį) ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // 1. Bandome prisijungti (signInWithPassword)
    let { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (signInError) {
        // 2. Jei prisijungti nepavyko (vartotojas neegzistuoja), bandome užregistruoti
        if (signInError.message.includes("Invalid login credentials") || signInError.message.includes("User not found")) {
             
             // Prieš registraciją, patikriname slaptažodžio ilgį (reikalaujama 6 simbolių)
             if (password.length < 6) {
                setError('Slaptažodis per trumpas. Turi būti bent 6 simboliai.');
                setLoading(false);
                return;
             }

             const { error: signUpError } = await supabase.auth.signUp({
                email,
                password,
             });

            if (signUpError) {
                setError(`Registracijos klaida: ${signUpError.message}.`);
                setLoading(false);
                return;
            }
            
            // Po sėkmingos registracijos (Supabase automatiškai sukuria sesiją)
            setShowLoginModal(false);
            setLoading(false);
            return;
        }

        setError(`Prisijungimo klaida: ${signInError.message}`);
        setLoading(false);
        return;
    }

    // 3. Prisijungimas sėkmingas
    setShowLoginModal(false);
    setLoading(false);
  };

  // --- Google prisijungimas (paliekamas kaip buvo, bet nebus aktyvus be rakto) ---
  const signInWithGoogle = async () => {
    setError('Google prisijungimas reikalauja Google Cloud kredencialų (Client ID/Secret) ir gali prašyti kortelės duomenų.');
  };

  return (
    <div className="card">
      <h3>Prisijunk</h3>
      <div style={{display:'flex',gap:'8px', flexDirection: 'column'}}>
        <button 
          className="btn" 
          onClick={signInWithGoogle}
          style={{backgroundColor: '#DB4437', color: 'white', border: 'none'}}
        >
          Prisijungti su Google
        </button>
        <button 
          className="btn" 
          onClick={() => { setShowLoginModal(true); setError(null); }}
          style={{backgroundColor: '#10B981', color: 'white', border: 'none'}}
        >
          El. paštas / Slaptažodis
        </button>
      </div>
      <p style={{color:'var(--muted)',marginTop:'12px'}}>Nemokamai {INITIAL_QUOTA} žinučių pradžiai</p>

      {error && <p style={{color:'#F87171', marginTop:'12px', textAlign: 'center'}}>{error}</p>}

      {/* Prisijungimo/Registracijos Modalas */}
      {showLoginModal && (
        <div className="modal-overlay" style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
            backgroundColor: 'rgba(0, 0, 0, 0.7)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
        }}>
            <div className="modal-content" style={{
                backgroundColor: '#374151', padding: '24px', borderRadius: '12px', 
                maxWidth: '400px', width: '90%', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
            }}>
                <h3 style={{color:'white', fontSize:'1.25rem', marginBottom:'16px', textAlign:'center'}}>
                    Prisijungimas / Registracija
                </h3>
                <p style={{color:'#D1D5DB', fontSize:'0.875rem', marginBottom:'16px', textAlign:'center'}}>
                    Suvedus el. paštą ir slaptažodį (min. 6 simboliai), būsite **automatiškai užregistruotas** ir prijungtas.
                </p>
                <form onSubmit={handleLogin} style={{display:'flex', flexDirection:'column', gap:'12px'}}>
                    <input
                        type="email"
                        placeholder="El. paštas"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{padding: '10px', borderRadius: '8px', border: '1px solid #4B5563', backgroundColor: '#1F2937', color: 'white'}}
                    />
                    <input
                        type="password"
                        placeholder="Slaptažodis"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                        style={{padding: '10px', borderRadius: '8px', border: '1px solid #4B5563', backgroundColor: '#1F2937', color: 'white'}}
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn"
                        style={{padding: '12px', backgroundColor: loading ? '#6B7280' : '#059669', color: 'white', borderRadius: '8px', border: 'none', fontWeight: 'bold'}}
                    >
                        {loading ? <Loader2 size={20} style={{display:'inline-block', verticalAlign:'middle'}} className="animate-spin mr-2" /> : 'Prisijungti / Registruotis'}
                    </button>
                </form>
                <button
                    onClick={() => { setShowLoginModal(false); setError(null); }}
                    style={{marginTop: '12px', width: '100%', color: '#9CA3AF', background: 'none', border: 'none', cursor: 'pointer', fontSize:'0.875rem'}}
                >
                    Uždaryti
                </button>
            </div>
        </div>
      )}
    </div>
  );
}

