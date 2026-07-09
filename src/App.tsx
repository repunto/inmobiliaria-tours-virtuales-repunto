import React, { useState, useEffect } from 'react';
import { InmoData } from './types/inmo';
import { InmoViewer } from './components/InmoViewer';

const App: React.FC = () => {
  const [inmoData, setInmoData] = useState<InmoData | null>(null);
  const [activeSceneId, setActiveSceneId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Carga de la especificación JSON del inmueble al arrancar
  useEffect(() => {
    fetch('assets/inmuebles/propiedad-ejemplo/inmo-spec.json')
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
  }, []);

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Cargando Recorrido Inmersivo Premium...</p>
      </div>
    );
  }

  if (error || !inmoData) {
    return (
      <div style={styles.errorContainer}>
        <i className="fa-solid fa-triangle-exclamation" style={styles.errorIcon}></i>
        <h3 style={styles.errorTitle}>Error al Cargar la Propiedad</h3>
        <p style={styles.errorText}>{error || 'Datos del inmueble no disponibles.'}</p>
      </div>
    );
  }

  // Buscar la escena activa actual
  const activeScene = inmoData.scenes.find((s) => s.id === activeSceneId);

  // Manejar cambio de escena por navegación o clics
  const handleNavigate = (sceneId: string) => {
    setActiveSceneId(sceneId);
  };

  // Formatear precio
  const formatPrice = (price?: number, currency?: string) => {
    if (!price) return 'Consultar precio';
    const symbol = currency === 'EUR' ? '€' : '$';
    return `${symbol}${price.toLocaleString()}`;
  };

  return (
    <div style={styles.appWrapper}>
      {/* 1. Visor 360 Principal */}
      <div style={styles.viewerSection}>
        {activeScene ? (
          <InmoViewer scene={activeScene} onNavigate={handleNavigate} />
        ) : (
          <div style={styles.noSceneContainer}>
            <p>Selecciona una habitación para comenzar el recorrido.</p>
          </div>
        )}
      </div>

      {/* 2. Panel Flotante de Ficha Técnica (Alineación Glassmorphic) */}
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

      {/* 3. Panel de Navegación Rápida de Habitaciones (Top Right) */}
      <div className="glass-panel" style={styles.navigationPanel}>
        <div style={styles.panelLabel}>Habitaciones de la Propiedad:</div>
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

      {/* 4. Planta Interactiva Flotante (Bottom Right) */}
      {inmoData.floorPlan && (
        <div className="glass-panel" style={styles.floorPlanPanel}>
          <div style={styles.panelLabel}>Planta y Distribución:</div>
          <div style={styles.floorPlanImageWrapper}>
            {/* Como no tenemos la imagen física, renderizamos un croquis minimalista con CSS */}
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
                      left: `${room.coords.x / 6}%`, // Escalamos sobre un contenedor de 100px aprox
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

// Estilos en JS Inline con Tokens de Variables CSS para compatibilidad estricta
const styles: { [key: string]: React.CSSProperties } = {
  appWrapper: {
    width: '100vw',
    height: '100vh',
    position: 'relative',
    overflow: 'hidden',
  },
  viewerSection: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1,
  },
  noSceneContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  loadingContainer: {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0a0c10',
  },
  spinner: {
    border: '3px solid rgba(212, 175, 55, 0.1)',
    borderRadius: '50%',
    borderTop: '3px solid var(--accent-gold)',
    width: '50px',
    height: '50px',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    marginTop: '20px',
    color: '#9ca3af',
    fontSize: '0.95rem',
    fontWeight: 500,
  },
  errorContainer: {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0a0c10',
    padding: '2rem',
    textAlign: 'center',
  },
  errorIcon: {
    fontSize: '3rem',
    color: 'var(--error)',
    marginBottom: '1rem',
  },
  errorTitle: {
    color: '#f3f4f6',
    fontSize: '1.5rem',
    fontWeight: 600,
    marginBottom: '0.5rem',
  },
  errorText: {
    color: '#9ca3af',
    maxWidth: '500px',
  },
  commercialCard: {
    position: 'absolute',
    bottom: '30px',
    left: '30px',
    width: '420px',
    maxHeight: '400px',
    zIndex: 10,
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: 'var(--glass-shadow)',
  },
  commercialHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1rem',
  },
  propTitle: {
    fontFamily: 'var(--font-serif)',
    fontSize: '1.6rem',
    fontWeight: 600,
    color: 'var(--accent-gold)',
    margin: 0,
  },
  propLocation: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    margin: '4px 0 0 0',
  },
  priceContainer: {
    textAlign: 'right',
  },
  propPrice: {
    fontSize: '1.4rem',
    fontWeight: 700,
    color: '#ffffff',
  },
  tagExclusivo: {
    display: 'inline-block',
    fontSize: '0.65rem',
    fontWeight: 700,
    backgroundColor: 'var(--accent-gold)',
    color: '#0a0c10',
    padding: '2px 6px',
    borderRadius: '4px',
    marginTop: '4px',
  },
  featureGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '0.6rem',
    marginBottom: '1rem',
  },
  featureBadge: {
    backgroundColor: 'rgba(10, 12, 16, 0.5)',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    padding: '0.45rem 0.75rem',
    fontSize: '0.8rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: 'var(--text-primary)',
  },
  divider: {
    border: 'none',
    borderTop: '1px solid var(--border-color)',
    margin: '0 0 1rem 0',
  },
  descriptionScroll: {
    flex: 1,
    overflowY: 'auto',
    maxHeight: '120px',
    paddingRight: '6px',
  },
  propDescription: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    lineHeight: 1.5,
    margin: 0,
  },
  navigationPanel: {
    position: 'absolute',
    top: '30px',
    right: '30px',
    zIndex: 10,
    padding: '0.85rem 1.25rem',
    boxShadow: 'var(--glass-shadow)',
    width: '320px',
  },
  panelLabel: {
    fontSize: '0.75rem',
    fontWeight: 700,
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '8px',
  },
  navigationButtonContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  sceneBtn: {
    background: 'transparent',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    color: 'var(--text-secondary)',
    fontSize: '0.85rem',
    fontWeight: 500,
    padding: '0.5rem 0.85rem',
    textAlign: 'left',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    transition: 'all 0.2s ease',
  },
  sceneBtnActive: {
    backgroundColor: 'var(--accent-gold)',
    borderColor: 'var(--accent-gold)',
    color: '#0a0c10',
    fontWeight: 600,
  },
  floorPlanPanel: {
    position: 'absolute',
    bottom: '30px',
    right: '30px',
    zIndex: 10,
    padding: '0.85rem 1.25rem',
    boxShadow: 'var(--glass-shadow)',
    width: '220px',
  },
  floorPlanImageWrapper: {
    marginTop: '8px',
    width: '100%',
    height: '120px',
    backgroundColor: 'rgba(10, 12, 16, 0.6)',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    overflow: 'hidden',
    position: 'relative',
  },
  floorPlanDummy: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  floorPlanIconBackground: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: '2.5rem',
    color: 'rgba(255, 255, 255, 0.03)',
    pointerEvents: 'none',
  },
  floorPlanDot: {
    position: 'absolute',
    width: '12px',
    height: '12px',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    border: '2px solid #ffffff',
    borderRadius: '50%',
    cursor: 'pointer',
    transform: 'translate(-50%, -50%)',
    transition: 'all 0.2s ease',
    boxShadow: '0 0 4px rgba(0,0,0,0.5)',
    padding: 0,
  },
  floorPlanDotActive: {
    backgroundColor: 'var(--accent-gold)',
    border: '2px solid var(--accent-gold)',
    transform: 'translate(-50%, -50%) scale(1.3)',
    boxShadow: '0 0 8px var(--accent-gold)',
  },
};

export default App;
