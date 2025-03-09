/**
 * FileDropzone component lets users drag and drop files or click to upload.
 * It extends react-dropzone's options and accepts additional custom props.
 */
import * as React from 'react';
import type { DropzoneOptions } from 'react-dropzone';
import { useDropzone, FileWithPath } from 'react-dropzone';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { CloudArrowUp as CloudArrowUpIcon } from '@phosphor-icons/react';
import { camera } from 'ionicons/icons';
import { IonButton, IonIcon, isPlatform } from '@ionic/react';

// Define additional props that extend DropzoneOptions
export interface FileDropzoneProps extends DropzoneOptions {
  caption?: React.ReactNode;
  files?: File[];
  onRemove?: (file: File) => void;
  onRemoveAll?: () => void;
  onUpload?: () => void;
  isSimple?: boolean;
}

/**
 * FileDropzone component allows file drag & drop and clicking to select files.
 * For mobile devices it optionally supports picking images from the gallery.
 */
export function FileDropzone({ caption, isSimple, ...props }: FileDropzoneProps): React.JSX.Element {
  const { getRootProps, getInputProps, isDragActive } = useDropzone(props);
  const isMobile = isPlatform('mobile');

  // Function to pick images from gallery (for Android, for example)
  const pickImagesFromGallery = async () => {
    try {
      // @ts-expect-error: Capacitor Camera API
      const result = await Camera.pickImages({
        quality: 80,
        limit: 50,
        height: 1920,
        width: 1920,
        types: ['image', 'video'], // Allow both images and videos
      });
      const files = await Promise.all(
        result.photos.map(async (photo: any) => {
          const response = await fetch(photo.webPath);
          const blob = await response.blob();
          const fileName = `${photo.webPath.split('/').pop()}.${blob.type.split('/')[1]}`;
          const file = new File([blob], fileName, { type: blob.type });
          return file as FileWithPath;
        })
      );
      props.onDrop?.(files, []); // Call onDrop with accepted files (no rejections in this case)
    } catch (error) {
      console.error('Error picking images from gallery:', error);
    }
  };

  if (isMobile) {
    return (
      <Box
        sx={{
          alignItems: 'center',
          border: '1px dashed var(--mui-palette-divider)',
          borderRadius: 1,
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          outline: 'none',
          p: 4,
        }}
      >
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
          <Avatar
            sx={{
              width: 60,
              height: 60,
              bgcolor: 'var(--mui-palette-background-paper)',
              boxShadow: 8,
              color: 'var(--mui-palette-text-primary)',
            }}
          >
            <CloudArrowUpIcon fontSize="large" />
          </Avatar>
          <Stack spacing={1}>
            <IonButton
              {...getRootProps()}
              // Replace sx with inline style
              style={{ textDecoration: 'underline', justifyContent: 'center', lineHeight: '1rem' }}
              variant="primary"
            >
              Click to upload media
              <input {...getInputProps()} />
            </IonButton>
            {isSimple ? null : (
              <>
                {isPlatform('android') && (
                  <IonButton
                    onClick={pickImagesFromGallery}
                    style={{ textDecoration: 'underline', justifyContent: 'center', lineHeight: '1rem' }}
                    variant="primary"
                  >
                    <IonIcon slot="start" icon={camera}></IonIcon>
                    Pick Images from Gallery
                  </IonButton>
                )}
              </>
            )}
          </Stack>
        </Stack>
      </Box>
    );
  } else {
    return (
      <Box
        sx={{
          alignItems: 'center',
          border: '1px dashed var(--mui-palette-divider)',
          borderRadius: 1,
          cursor: 'pointer',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          outline: 'none',
          p: 6,
          ...(isDragActive && { bgcolor: 'var(--mui-palette-action-selected)', opacity: 0.5 }),
          '&:hover': { ...(!isDragActive && { bgcolor: 'var(--mui-palette-action-hover)' }) },
        }}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
          <Avatar
            sx={{
              width: 60,
              height: 60,
              bgcolor: 'var(--mui-palette-background-paper)',
              boxShadow: 8,
              color: 'var(--mui-palette-text-primary)',
            }}
          >
            <CloudArrowUpIcon fontSize="large" />
          </Avatar>
          <Stack spacing={1}>
            <Typography variant="h6">
              <Typography component="span" style={{ textDecoration: 'underline' }} variant="inherit">
                Click to upload
              </Typography>{' '}
              or drag and drop
            </Typography>
            {caption ? (
              <Typography color="text.secondary" variant="body2">
                {caption}
              </Typography>
            ) : null}
          </Stack>
        </Stack>
      </Box>
    );
  }
}