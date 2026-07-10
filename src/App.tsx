import React, { useState, useEffect } from 'react';
import { InmoViewer } from './components/InmoViewer';
import { InmoData } from './types/inmo';

interface PropertyItem {
  id: string;
  title: string;
  price: number;
  currency: string;
  location: string;
  coverImage: string;
  area: number;
  rooms: number;
  baths: number;
  parking: number;
  specPath: string;
  description: string;
}

const PROPERTIES: PropertyItem[] = [
  {
    id: 'villa-albatros',
    title: 'Villa Albatros',
    price: 2450000,
    currency: 'USD',
    location: 'Pedralbes, Barcelona',
    coverImage: 'assets/inmuebles/propiedad-ejemplo/media/cover.webp',
    area: 450,
    rooms: 5,
    baths: 4,
    parking: 3,
    specPath: 'assets/inmuebles/propiedad-ejemplo/inmo-spec.json',
    description: 'Una obra maestra de la arquitectura moderna con vistas incomparables al mar y acabados de lujo.'
  }
];

const App: React.FC = () => {
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [inmoData, setInmoData] = useState<InmoData | null>(null);
  const [activeSceneId, setActiveSceneId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const propId = params.get('prop');
    if (propId) {
      const match = PROPERTIES.find(p => p.id === propId);
      if (match) {
        setSelectedPropertyId(propId);
      }
    }
  }, []);

  useEffect(() => {
    if (!selectedPropertyId) return;

    const prop = PROPERTIES.find(p => p.id === selectedPropertyId);
    if (!prop) {
      setError('Propiedad no encontrada en el catálogo.');
      return;
    }

    setLoading(true);
    setError(null);

    fetch(prop.specPath)
      .then((res) => {
        if (!res.ok) {
          throw new Error('No se pudo cargar el archivo de especificación del inmueble.');
        }
        return res.json();
      })
      .then((data: InmoData) => {
        setInmoData(data);
        setActiveSceneId(data.settings.initialSceneId);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error al cargar inmo-spec.json:', err);
        setError(err.message);
        setLoading(false);
      });
  }, [selectedPropertyId]);

  const handleBackToCatalog = () => {
    setSelectedPropertyId(null);
    setInmoData(null);
    setError(null);
    
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
    window.history.pushState({ path: newUrl }, '', newUrl);
  };

  const handleSelectProperty = (id: string) => {
    setSelectedPropertyId(id);
    const newUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}?prop=${id}`;
    window.history.pushState({ path: newUrl }, '', newUrl);
  };

  const handleNavigate = (sceneId: string) => {
    setActiveSceneId(sceneId);
  };

  const formatPrice = (price?: number, currency?: string) => {
    if (!price) return 'Consultar precio';
    const symbol = currency === 'EUR' ? '€' : '$';
    return `${symbol}${price.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Cargando Recorrido Inmersivo Premium...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.errorContainer}>
        <i className="fa-solid fa-triangle-exclamation" style={styles.errorIcon}></i>
        <h3 style={styles.errorTitle}>Error de Carga</h3>
        <p style={styles.errorText}>{error}</p>
        <button onClick={handleBackToCatalog} style={styles.errorBtn}>
          Volver al Catálogo de Propiedades
        </button>
      </div>
    );
  }

  if (!selectedPropertyId || !inmoData) {
    return (
      <div style={styles.catalogWrapper}>
        <header style={styles.catalogHeader}>
          <div style={styles.logoContainer}>
            <i className="fa-solid fa-map-location-dot" style={styles.logoIcon}></i>
            <span style={styles.logoText}>SAMIMUNAY</span>
            <span style={styles.logoSubtext}>PREMIUM PROPERTIES</span>
          </div>
        </header>

        <section style={styles.heroSection}>
          <h1 style={styles.heroTitle}>Portafolio de Recorridos Virtuales 360°</h1>
          <p style={styles.heroSubtitle}>
            Explora de manera inmersiva nuestras exclusivas propiedades mediante tecnología interactiva de última generación.
          </p>
          <div style={styles.goldLine}></div>
        </section>

        <main style={styles.catalogGrid}>
          {PROPERTIES.map((prop) => (
            <div key={prop.id} className="glass-panel-gold" style={styles.catalogCard}>
              <div 
                style={{ 
                  ...styles.cardImage, 
                  backgroundImage: `url(${prop.coverImage})` 
                }}
              />
              <div style={styles.cardContent}>
                <div style={styles.cardHeader}>
                  <h2 style={styles.cardTitle}>{prop.title}</h2>
                  <span style={styles.cardPrice}>{formatPrice(prop.price, prop.currency)}</span>
                </div>
                
                <p style={styles.cardLocation}>
                  <i className="fa-solid fa-map-marker-alt" style={{ marginRight: '6px' }}></i>
                  {prop.location}
                </p>

                <p style={styles.cardDesc}>{prop.description}</p>

                <div style={styles.cardSpecs}>
                  <span style={styles.specItem}><i className="fa-solid fa-ruler-combined"></i> {prop.area} m²</span>
                  <span style={styles.specItem}><i className="fa-solid fa-bed"></i> {prop.rooms} Dorm.</span>
                  <span style={styles.specItem}><i className="fa-solid fa-bath"></i> {prop.baths} Baños</span>
                </div>

                <button 
                  onClick={() => handleSelectProperty(prop.id)}
                  style={styles.cardBtn}
                  className="btn-gold-hover"
                >
                  <i className="fa-solid fa-circle-play" style={{ marginRight: '8px' }}></i>
                  Iniciar Recorrido 360°
                </button>
              </div>
            </div>
          ))}
        </main>

        <footer style={styles.catalogFooter}>
          <p>Tecnología Inmobiliaria Inmersiva © 2026. Todos los derechos reservados.</p>
        </footer>
      </div>
    );
  }

  const activeScene = inmoData.scenes.find((s) => s.id === activeSceneId);

  return (
    <div style={styles.appWrapper}>
      <div style={styles.viewerSection}>
        {activeScene ? (
          <InmoViewer scene={activeScene} onNavigate={handleNavigate} />
        ) : (
          <div style={styles.noSceneContainer}>
            <p>Selecciona una habitación para comenzar el recorrido.</p>
          </div>
        )}
      </div>

      <button 
        onClick={handleBackToCatalog} 
        style={styles.backButton} 
        className="glass-panel"
        title="Regresar al listado de propiedades"
      >
        <i className="fa-solid fa-arrow-left"></i>
        <span>Catálogo</span>
      </button>

      <div className="glass-panel-gold" style={styles.commercialCard}>
        <div style={styles.commercialHeader}>
          <div>
            <h1 style={styles.propTitle}>{inmoData.title}</h1>
            <p style={styles.propLocation}>
              <i className="fa-solid fa-map-marker-alt" style={{ marginRight: '6px' }}></i>
              {inmoData.location || 'Ubicación Premium'}
            </p>
          </div>
          <div style={styles.priceContainer}>
            <div style={styles.propPrice}>{formatPrice(inmoData.price, inmoData.currency)}</div>
            <span style={styles.tagExclusivo}>EXCLUSIVO</span>
          </div>
        </div>

        <div style={styles.featureGrid}>
          <div style={styles.featureBadge}>
            <i className="fa-solid fa-ruler-combined"></i>
            <span>{inmoData.area || 0} m²</span>
          </div>
          <div style={styles.featureBadge}>
            <i className="fa-solid fa-bed"></i>
            <span>{inmoData.rooms || 0} Dorm.</span>
          </div>
          <div style={styles.featureBadge}>
            <i className="fa-solid fa-bath"></i>
            <span>{inmoData.baths || 0} Baños</span>
          </div>
          <div style={styles.featureBadge}>
            <i className="fa-solid fa-car"></i>
            <span>{inmoData.parking || 0} Garajes</span>
          </div>
        </div>

        <hr style={styles.divider} />

        <div style={styles.descriptionScroll} className="custom-scrollbar">
          <p style={styles.propDescription}>{inmoData.description}</p>
        </div>
      </div>

      <div className="glass-panel" style={styles.navigationPanel}>
        <div style={styles.panelLabel}>Habitaciones:</div>
        <div style={styles.navigationButtonContainer}>
          {inmoData.scenes.map((scene) => {
            const isActive = scene.id === activeSceneId;
            return (
              <button
                key={scene.id}
                style={{
                  ...styles.sceneBtn,
                  ...(isActive ? styles.sceneBtnActive : {}),
                }}
                onClick={() => handleNavigate(scene.id)}
              >
                <i
                  className={`fa-solid ${scene.type === '3d-model' ? 'fa-cube' : 'fa-image'}`}
                  style={{ marginRight: '6px', color: isActive ? '#0a0c10' : 'var(--accent-gold)' }}
                ></i>
                {scene.name}
              </button>
            );
          })}
        </div>
      </div>

      {inmoData.floorPlan && (
        <div className="glass-panel" style={styles.floorPlanPanel}>
          <div style={styles.panelLabel}>Planta:</div>
          <div style={styles.floorPlanImageWrapper}>
            <div style={styles.floorPlanDummy}>
              <i className="fa-solid fa-map-location-dot" style={styles.floorPlanIconBackground}></i>
              {inmoData.floorPlan.rooms.map((room) => {
                const isActive = room.sceneId === activeSceneId;
                return (
                  <button
                    key={room.sceneId}
                    title={room.name}
                    onClick={() => handleNavigate(room.sceneId)}
                    style={{
                      ...styles.floorPlanDot,
                      left: `${room.coords.x / 6}%`,
                      top: `${room.coords.y / 4.5}%`,
                      ...(isActive ? styles.floorPlanDotActive : {}),
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  appWrapper: { width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' },
  viewerSection: { width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 1 },
  noSceneContainer: { width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#000' },
  loadingContainer: { width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0a0c10' },
  spinner: { border: '3px solid rgba(212, 175, 55, 0.1)', borderRadius: '50%', borderTop: '3px solid var(--accent-gold)', width: '50px', height: '50px', animation: 'spin 1s linear infinite' },
  loadingText: { marginTop: '20px', color: '#9ca3af', fontSize: '0.95rem', fontWeight: 500 },
  errorContainer: { width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0a0c10', padding: '2rem', textAlign: 'center' },
  errorIcon: { fontSize: '3rem', color: '#ef4444', marginBottom: '1rem' },
  errorTitle: { color: '#f3f4f6', fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem' },
  errorText: { color: '#9ca3af', maxWidth: '500px', marginBottom: '1.5rem' },
  errorBtn: { backgroundColor: 'var(--accent-gold)', border: 'none', borderRadius: '8px', color: '#0a0c10', padding: '0.75rem 1.5rem', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' },
  backButton: { position: 'absolute', top: '30px', left: '30px', zIndex: 10, padding: '0.6rem 1.2rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-gold)', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', border: '1px solid rgba(212, 175, 55, 0.2)', boxShadow: 'var(--glass-shadow)' },
  commercialCard: { position: 'absolute', bottom: '30px', left: '30px', width: '420px', maxHeight: '400px', zIndex: 10, padding: '1.5rem', display: 'flex', flexDirection: 'column', boxShadow: 'var(--glass-shadow)' },
  commercialHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' },
  propTitle: { fontFamily: 'var(--font-serif)', fontSize: '1.6rem', fontWeight: 600, color: 'var(--accent-gold)', margin: 0 },
  propLocation: { fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '4px 0 0 0' },
  priceContainer: { textAlign: 'right' },
  propPrice: { fontSize: '1.4rem', fontWeight: 700, color: '#ffffff' },
  tagExclusivo: { display: 'inline-block', fontSize: '0.65rem', fontWeight: 700, backgroundColor: 'var(--accent-gold)', color: '#0a0c10', padding: '2px 6px', borderRadius: '4px', marginTop: '4px' },
  featureGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.6rem', marginBottom: '1rem' },
  featureBadge: { backgroundColor: 'rgba(10, 12, 16, 0.5)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.45rem 0.75rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)' },
  divider: { border: 'none', borderTop: '1px solid var(--border-color)', margin: '0 0 1rem 0' },
  descriptionScroll: { flex: 1, overflowY: 'auto', maxHeight: '120px', paddingRight: '6px' },
  propDescription: { fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 },
  navigationPanel: { position: 'absolute', top: '30px', right: '30px', zIndex: 10, padding: '0.85rem 1.25rem', boxShadow: 'var(--glass-shadow)', width: '320px' },
  panelLabel: { fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' },
  navigationButtonContainer: { display: 'flex', flexDirection: 'column', gap: '6px' },
  sceneBtn: { background: 'transparent', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500, padding: '0.5rem 0.85rem', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', transition: 'all 0.2s ease' },
  sceneBtnActive: { backgroundColor: 'var(--accent-gold)', borderColor: 'var(--accent-gold)', color: '#0a0c10', fontWeight: 600 },
  floorPlanPanel: { position: 'absolute', bottom: '30px', right: '30px', zIndex: 10, padding: '0.85rem 1.25rem', boxShadow: 'var(--glass-shadow)', width: '220px' },
  floorPlanImageWrapper: { marginTop: '8px', width: '100%', height: '120px', backgroundColor: 'rgba(10, 12, 16, 0.6)', border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden', position: 'relative' },
  floorPlanDummy: { width: '100%', height: '100%', position: 'relative' },
  floorPlanIconBackground: { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '2.5rem', color: 'rgba(255, 255, 255, 0.03)', pointerEvents: 'none' },
  floorPlanDot: { position: 'absolute', width: '12px', height: '12px', backgroundColor: 'rgba(255, 255, 255, 0.3)', border: '2px solid #ffffff', borderRadius: '50%', cursor: 'pointer', transform: 'translate(-50%, -50%)', transition: 'all 0.2s ease', boxShadow: '0 0 4px rgba(0,0,0,0.5)', padding: 0 },
  floorPlanDotActive: { backgroundColor: 'var(--accent-gold)', border: '2px solid var(--accent-gold)', transform: 'translate(-50%, -50%) scale(1.3)', boxShadow: '0 0 8px var(--accent-gold)' },
  catalogWrapper: { width: '100vw', minHeight: '100vh', backgroundColor: '#0a0c10', color: '#ffffff', display: 'flex', flexDirection: 'column', overflowY: 'auto' },
  catalogHeader: { padding: '2rem 3rem 1rem 3rem', display: 'flex', justifyContent: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' },
  logoContainer: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' },
  logoIcon: { fontSize: '1.8rem', color: 'var(--accent-gold)', marginBottom: '4px' },
  logoText: { fontSize: '1.4rem', fontWeight: 700, letterSpacing: '3px', color: '#ffffff', fontFamily: 'var(--font-serif)' },
  logoSubtext: { fontSize: '0.6rem', fontWeight: 500, letterSpacing: '4px', color: 'var(--text-muted)' },
  heroSection: { textAlign: 'center', padding: '4rem 2rem 2.5rem 2rem', maxWidth: '800px', margin: '0 auto' },
  heroTitle: { fontSize: '2.5rem', fontWeight: 600, fontFamily: 'var(--font-serif)', color: 'var(--accent-gold)', margin: '0 0 1rem 0' },
  heroSubtitle: { fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 },
  goldLine: { width: '80px', height: '2px', backgroundColor: 'var(--accent-gold)', margin: '1.5rem auto 0 auto', borderRadius: '1px' },
  catalogGrid: { flex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '2.5rem', padding: '0 3rem 4rem 3rem', maxWidth: '1200px', width: '100%', margin: '0 auto', boxSizing: 'border-box' },
  catalogCard: { borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: 'var(--glass-shadow)', transition: 'transform 0.3s ease, border-color 0.3s ease' },
  cardImage: { width: '100%', height: '240px', backgroundSize: 'cover', backgroundPosition: 'center' },
  cardContent: { padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' },
  cardTitle: { fontSize: '1.35rem', fontWeight: 600, fontFamily: 'var(--font-serif)', color: 'var(--accent-gold)', margin: 0 },
  cardPrice: { fontSize: '1.25rem', fontWeight: 700, color: '#ffffff' },
  cardLocation: { fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '0 0 1rem 0' },
  cardDesc: { fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: '0 0 1.25rem 0', flex: 1 },
  cardSpecs: { display: 'flex', gap: '1.2rem', marginBottom: '1.5rem', fontSize: '0.78rem', color: 'var(--text-secondary)' },
  specItem: { display: 'flex', alignItems: 'center', gap: '6px' },
  cardBtn: { backgroundColor: 'transparent', border: '1px solid var(--accent-gold)', borderRadius: '8px', color: 'var(--accent-gold)', padding: '0.75rem', fontSize: '0.88rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s ease', width: '100%' },
  catalogFooter: { padding: '2rem 1rem', textAlign: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.05)', color: 'var(--text-muted)', fontSize: '0.75rem' },
};

export default App;
