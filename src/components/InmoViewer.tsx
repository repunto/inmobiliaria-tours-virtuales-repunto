import React, { useEffect, useRef } from 'react';
import { Scene } from '../types/inmo';

// Declaración global para acceder a la librería Pannellum cargada por CDN
declare global {
  interface Window {
    pannellum: any;
  }
}

interface InmoViewerProps {
  scene: Scene;
  onNavigate: (sceneId: string) => void;
}

export const InmoViewer: React.FC<InmoViewerProps> = ({ scene, onNavigate }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerInstance = useRef<any>(null);

  useEffect(() => {
    // Destruir instancia anterior si existe
    if (viewerInstance.current) {
      try {
        viewerInstance.current.destroy();
        viewerInstance.current = null;
      } catch (err) {
        console.error('Error al destruir visor Pannellum:', err);
      }
    }

    if (!containerRef.current || !window.pannellum) return;

    // Configuración básica de Pannellum para la escena
    const viewerConfig = {
      type: 'equirectangular',
      panorama: scene.panoramaUrl || '',
      yaw: scene.initialView.yaw,
      pitch: scene.initialView.pitch,
      hfov: scene.initialView.fov,
      autoLoad: true,
      showZoomCtrl: true,
      showFullscreenCtrl: true,
      mouseZoom: true,
      hotSpots: [] as any[]
    };

    // Añadir límites visuales si existen
    if (scene.limits) {
      if (scene.limits.pitchMin !== undefined) (viewerConfig as any).pitchMin = scene.limits.pitchMin;
      if (scene.limits.pitchMax !== undefined) (viewerConfig as any).pitchMax = scene.limits.pitchMax;
      if (scene.limits.fovMin !== undefined) (viewerConfig as any).hfovMin = scene.limits.fovMin;
      if (scene.limits.fovMax !== undefined) (viewerConfig as any).hfovMax = scene.limits.fovMax;
    }

    // Mapear hotspots
    if (scene.hotspots && scene.hotspots.length > 0) {
      viewerConfig.hotSpots = scene.hotspots.map(hs => {
        const pHS: any = {
          pitch: hs.pitch,
          yaw: hs.yaw,
          cssClass: `custom-hotspot-${hs.style?.icon || 'info'} hotspot-pulsing`,
          createTooltipFunc: (hotSpotDiv: HTMLElement) => {
            // Dibujar icono
            const icon = document.createElement('i');
            icon.className = `fa-solid fa-${hs.style?.icon || 'info'}`;
            icon.style.color = hs.style?.color || '#d4af37';
            icon.style.fontSize = '18px';
            icon.style.background = 'rgba(10,12,16,0.9)';
            icon.style.padding = '8px';
            icon.style.borderRadius = '50%';
            icon.style.border = `1px solid ${hs.style?.color || '#d4af37'}`;
            icon.style.cursor = 'pointer';
            
            hotSpotDiv.appendChild(icon);

            // Crear Tooltip
            const tooltipSpan = document.createElement('span');
            tooltipSpan.innerText = hs.title;
            tooltipSpan.style.visibility = 'hidden';
            tooltipSpan.style.position = 'absolute';
            tooltipSpan.style.bottom = '100%';
            tooltipSpan.style.left = '50%';
            tooltipSpan.style.transform = 'translateX(-50%)';
            tooltipSpan.style.backgroundColor = 'rgba(10,12,16,0.95)';
            tooltipSpan.style.color = '#fff';
            tooltipSpan.style.padding = '4px 8px';
            tooltipSpan.style.borderRadius = '4px';
            tooltipSpan.style.fontSize = '11px';
            tooltipSpan.style.whiteSpace = 'nowrap';
            tooltipSpan.style.marginBottom = '5px';
            tooltipSpan.style.border = '1px solid rgba(255, 255, 255, 0.1)';
            
            hotSpotDiv.appendChild(tooltipSpan);

            // Eventos Hover
            hotSpotDiv.addEventListener('mouseover', () => {
              tooltipSpan.style.visibility = 'visible';
            });
            hotSpotDiv.addEventListener('mouseout', () => {
              tooltipSpan.style.visibility = 'hidden';
            });
          }
        };

        // Enlace del evento clic
        if (hs.type === 'navigation' && hs.targetSceneId) {
          pHS.clickHandlerFunc = () => {
            onNavigate(hs.targetSceneId!);
          };
        } else if (hs.type === 'info') {
          pHS.clickHandlerFunc = () => {
            // Al hacer clic, se despliega una alerta con la descripción del hotspot
            alert(`ℹ️ ${hs.title}\n\n${hs.description || ''}`);
          };
        }

        return pHS;
      });
    }

    // Inicializar Pannellum
    try {
      viewerInstance.current = window.pannellum.viewer(containerRef.current, viewerConfig);
    } catch (err) {
      console.error('Error al inicializar visor de Pannellum en React:', err);
    }

    // Cleanup al desmontar o cambiar de escena
    return () => {
      if (viewerInstance.current) {
        try {
          viewerInstance.current.destroy();
          viewerInstance.current = null;
        } catch (err) {
          // Ignorar errores al desmontar
        }
      }
    };
  }, [scene, onNavigate]);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <div 
        ref={containerRef} 
        style={{ width: '100%', height: '100%', backgroundColor: '#000' }} 
      />
    </div>
  );
};
