import sys
import os
import cv2

def main():
    # El primer argumento es la ruta de salida, los demás son las imágenes de entrada
    if len(sys.argv) < 3:
        print("ERROR: Se requiere al menos una ruta de salida y 2 imágenes de entrada.")
        sys.exit(1)
        
    output_path = sys.argv[1]
    input_paths = sys.argv[2:]
    
    # Validar archivos de entrada
    images = []
    for path in input_paths:
        if not os.path.exists(path):
            print(f"ERROR: El archivo de entrada no existe: {path}")
            sys.exit(1)
            
        img = cv2.imread(path)
        if img is None:
            print(f"ERROR: No se pudo leer la imagen (formato corrupto o no soportado): {path}")
            sys.exit(1)
        images.append(img)
        
    print(f"Iniciando costura local de {len(images)} imágenes...")
    
    # Crear costurador de OpenCV (Stitcher)
    try:
        stitcher = cv2.Stitcher_create()
        status, stitched = stitcher.stitch(images)
    except Exception as e:
        print(f"ERROR: Falló el motor de costura de OpenCV: {str(e)}")
        sys.exit(1)
        
    if status == cv2.Stitcher_OK:
        # Asegurar que el directorio de salida existe
        out_dir = os.path.dirname(output_path)
        if out_dir and not os.path.exists(out_dir):
            os.makedirs(out_dir, exist_ok=True)
            
        # Guardar la imagen panorámica final
        success = cv2.imwrite(output_path, stitched)
        if success:
            print(f"SUCCESS: Panorama guardado en {output_path}")
            sys.exit(0)
        else:
            print(f"ERROR: No se pudo escribir el archivo de salida en: {output_path}")
            sys.exit(1)
    else:
        # Detallar los errores comunes de costura de OpenCV
        error_msgs = {
            1: "ERR_NEED_MORE_IMGS (Se necesitan más imágenes o mayor solapamiento)",
            2: "ERR_HOMOGRAPHY_EST_FAIL (No se pudieron emparejar los puntos característicos/perspectiva)",
            3: "ERR_CAMERA_PARAMS_ADJUST_FAIL (Fallo al ajustar los parámetros de cámara/exposición)"
        }
        err_detail = error_msgs.get(status, f"Código de error: {status}")
        print(f"ERROR: La fusión de imágenes falló. Detalles: {err_detail}")
        sys.exit(1)

if __name__ == '__main__':
    main()
