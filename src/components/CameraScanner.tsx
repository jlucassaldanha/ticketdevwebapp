'use client';

import React, { useEffect, useRef } from 'react';
import { Box, Paper, Typography, Button } from '@mui/material';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import CameraswitchIcon from '@mui/icons-material/Cameraswitch';

interface CameraScannerProps {
  isCameraActive: boolean;
  selectedEventId: string;
  onToggleCamera: () => void;
  onScan: (hash: string) => void;
}

interface ScannerInstance {
  isScanning?: boolean;
  stop?: () => Promise<void>;
}

export const CameraScanner = ({ isCameraActive, selectedEventId, onToggleCamera, onScan }: CameraScannerProps) => {
  const scannerRef = useRef<ScannerInstance | null>(null);
  const onScanRef = useRef(onScan);

  useEffect(() => {
    onScanRef.current = onScan;
  }, [onScan]);

  useEffect(() => {
    async function startScanner() {
      if (!isCameraActive || !selectedEventId) return;

      try {
        const { Html5Qrcode } = await import('html5-qrcode');
        const html5Qrcode = new Html5Qrcode('qr-reader');
        
        
        scannerRef.current = html5Qrcode as unknown as ScannerInstance;

        await html5Qrcode.start(
          { facingMode: 'environment' }, 
          { fps: 10, qrbox: { width: 250, height: 250 } },
          (decodedText: string) => {
            onScanRef.current(decodedText);
            stopScanner(); 
          },
          () => { }
        );
      } catch (err) {
        console.error('Erro ao iniciar o leitor de QR Code:', err);
        alert('Não foi possível acessar a câmera. Verifique as permissões no navegador.');
        onToggleCamera(); 
      }
    }

    const stopScanner = async () => {
      const activeScanner = scannerRef.current;
      if (activeScanner) {
        try {
          if (activeScanner.isScanning && activeScanner.stop) {
            await activeScanner.stop();
          }
        } catch (err) {
          console.error('Erro ao parar a câmera:', err);
        } finally {
          scannerRef.current = null;
        }
      }
    };

    if (isCameraActive) {
      startScanner();
    } else {
      stopScanner();
    }

    return () => {
      const activeScanner = scannerRef.current;
      if (activeScanner && activeScanner.isScanning && activeScanner.stop) {
        activeScanner.stop().catch(console.error);
      }
    };
  }, [isCameraActive, selectedEventId, onToggleCamera]);

  return (
    <Paper 
      sx={{ 
        p: 4, height: '100%', display: 'flex', flexDirection: 'column', 
        alignItems: 'center', justifyContent: 'center',
        bgcolor: 'rgba(255, 255, 255, 0.01)', border: '2px dashed',
        borderColor: selectedEventId ? 'primary.main' : '#27272a',
        opacity: selectedEventId ? 1 : 0.4
      }}
    >
      {isCameraActive ? (
        <Box 
          id="qr-reader" 
          sx={{ 
            width: '100%', maxWidth: '320px', borderRadius: 3, 
            overflow: 'hidden', mb: 2, border: '1px solid #3f3f46',
            '& video': { borderRadius: '12px' }
          }} 
        />
      ) : (
        <QrCodeScannerIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2, animation: selectedEventId ? 'pulse 2s infinite' : 'none' }} />
      )}
      
      <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
        Scanner de Câmera
      </Typography>
      <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
        {isCameraActive 
          ? 'Aponte a câmera traseira do seu celular para o QR Code do ingresso.' 
          : 'No celular, clique no botão para ligar a câmera traseira e focar no QR Code impresso ou compartilhado.'}
      </Typography>
      
      <Button
        variant={isCameraActive ? "outlined" : "contained"}
        color={isCameraActive ? "error" : "primary"}
        disabled={!selectedEventId}
        startIcon={<CameraswitchIcon />}
        fullWidth
        onClick={onToggleCamera}
      >
        {isCameraActive ? 'Desligar Câmera' : 'Ligar Câmera'}
      </Button>
    </Paper>
  );
};