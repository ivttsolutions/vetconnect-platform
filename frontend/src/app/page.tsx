export default function Home() {
  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <div style={{ 
        textAlign: 'center',
        color: 'white',
        padding: '2rem'
      }}>
        <h1 style={{ 
          fontSize: '4rem', 
          fontWeight: 'bold', 
          marginBottom: '1rem',
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
        }}>
          🐾 VetConnect
        </h1>
        <p style={{ 
          fontSize: '1.5rem', 
          marginBottom: '2rem',
          opacity: 0.9
        }}>
          Professional Network for Veterinarians
        </p>
        <div style={{ 
          background: 'white', 
          color: '#333',
          padding: '2rem', 
          borderRadius: '12px', 
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          maxWidth: '500px',
          margin: '0 auto'
        }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
            ✅ Deployment Successful!
          </h2>
          <p style={{ marginBottom: '0.5rem' }}>
            Frontend: Running on port 3000
          </p>
          <p style={{ fontSize: '0.875rem', color: '#666' }}>
            {new Date().toLocaleString()}
          </p>
        </div>
      </div>
    </main>
  );
}