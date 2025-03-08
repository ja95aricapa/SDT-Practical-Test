'use client';

import * as React from 'react';
import { IonButton, IonIcon, isPlatform } from '@ionic/react';
import { ImageListItem } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { X as XIcon } from '@phosphor-icons/react';
import { trash } from 'ionicons/icons';
import Pica from 'pica';

import { FileDropzone, FileRejection } from '@/components/core/file-dropzone';
import { FileIcon } from '@/components/core/file-icon';
import { toast } from '@/components/core/toaster';

interface ExtendedFile extends File {
  preview: string;
}

function bytesToSize(bytes: number, decimals = 2): string {
  if (bytes === 0) {
    return '0 Bytes';
  }
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export interface UploaderProps {
  report: any;
  setReport: React.Dispatch<React.SetStateAction<any>>;
  onClose?: () => void;
  open?: boolean;
}

export function Uploader({ report, setReport, onClose }: UploaderProps): React.JSX.Element {
  // Si report.images es undefined, se asigna un array vacío
  const [files, setFiles] = React.useState<ExtendedFile[]>(report.images || []);
  const [open, setOpen] = React.useState<boolean>(true);
  const [isMobile] = React.useState<boolean>(isPlatform('mobile'));
  const [isCameraOpen, setIsCameraOpen] = React.useState(false);
  const [totalSize, setTotalSize] = React.useState(0);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [areLimitsExceeded, setAreLimitsExceeded] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [processingCount, setProcessingCount] = React.useState(0);
  const [totalFilesDropped, setTotalFilesDropped] = React.useState(0);

  const ACCEPTED_FILE_TYPES = {
    'image/jpeg': [],
    'image/jpg': [],
    'image/png': [],
    'video/mp4': [],
    'video/mpeg': [],
    'video/webm': [],
    'video/x-matroska': [],
    'video/quicktime': [],
    'application/pdf': [],
  };
  const MAX_FILE_SIZE = 200 * 1024 * 1024; // 200 MB
  const MAX_FILE_SIZE_SINGLE = 70 * 1024 * 1024; // 70 MB
  const MAX_FILE_COUNT = 50;

  // Actualizamos files cada vez que report.images cambie, asegurando siempre un array
  React.useEffect(() => {
    setFiles(report.images || []);
  }, [report.images, open]);

  const handleDrop = React.useCallback(
    async (newFiles: File[], type?: string) => {
      const totalFilesAfterAdd = files.length + newFiles.length;
      if (totalFilesAfterAdd > MAX_FILE_COUNT) {
        toast.error(`Too many files. Maximum allowed is ${MAX_FILE_COUNT}.`);
        return;
      }

      const totalSizeAfterAdd =
        files.reduce((acc, file) => acc + file.size, 0) + newFiles.reduce((acc, file) => acc + file.size, 0);

      if (totalSizeAfterAdd > MAX_FILE_SIZE) {
        toast.error(`Total selected files size exceeds ${bytesToSize(MAX_FILE_SIZE)}. Upload in smaller batches, images will be compressed.`);
        return;
      }

      setIsProcessing(true);
      setTotalFilesDropped(newFiles.length);
      try {
        const resizedFiles: ExtendedFile[] = [];
        for (const file of newFiles) {
          const newFilename = `${file.name}`;
          let blob;
          if (file.size > 2 * 1024 * 1024) {
            const isImageSupportedByPica = ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type);
            if (isImageSupportedByPica) {
              blob = await resizeUsingPica(file);
            } else {
              const arrayBuffer = await file.arrayBuffer();
              blob = new Blob([arrayBuffer], { type: file.type });
            }
          } else {
            const arrayBuffer = await file.arrayBuffer();
            blob = new Blob([arrayBuffer], { type: file.type });
          }
          const resizedFile = new File([blob], newFilename, { type: blob.type }) as ExtendedFile;
          resizedFile.preview = URL.createObjectURL(resizedFile);
          resizedFiles.push(resizedFile);
          setProcessingCount((prevCount) => prevCount + 1);
        }
        setFiles((prevFiles) => [...prevFiles, ...resizedFiles]);
        setReport((prevReport: any) => ({
          ...prevReport,
          images: [...(prevReport.images || []), ...resizedFiles],
        }));
      } catch (error) {
        console.error('Error during file processing:', error);
      } finally {
        setIsProcessing(false);
        setProcessingCount(0);
      }
    },
    [files, setReport]
  );

  async function resizeUsingPica(file: File): Promise<Blob> {
    const pica = new Pica({ features: ['js'] });
    const imageURL = URL.createObjectURL(file);
    const img = new Image();
    img.src = imageURL;
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = (error) => {
        console.error('Image failed to load', error);
        reject(error);
      };
    });
    const imgWidth = img.naturalWidth || img.width;
    const imgHeight = img.naturalHeight || img.height;
    const width = Math.round(imgWidth / 2);
    const height = Math.round(imgHeight / 2);
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    await pica.resize(img, canvas);
    URL.revokeObjectURL(imageURL);
    return new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Canvas is empty'));
          }
        },
        file.type,
        0.88
      );
    });
  }

  const handleDropRejected = (fileRejections: FileRejection[]) => {
    fileRejections.forEach((fileRejection) => {
      const { file, errors } = fileRejection;
      errors.forEach((error) => {
        switch (error.code) {
          case 'file-too-large':
            toast.error(`File size error: "${file.name}" is too large.`);
            break;
          case 'file-invalid-type':
            toast.error(`File type error: "${file.name}" has an invalid file type.`);
            break;
          case 'too-many-files':
            toast.error(`Too many files error: You have exceeded the maximum number of files (${MAX_FILE_COUNT}).`);
            break;
          default:
            toast.error(`Error with file "${file.name}": ${error.message}`);
            break;
        }
      });
    });
  };

  const handleDropSuccess = (files: File[]) => {
    console.log('Files accepted for processing:', files);
  };

  React.useEffect(() => {
    const newTotalSize = files.reduce((acc, file) => acc + file.size, 0);
    setTotalSize(newTotalSize);
    if (files.length > MAX_FILE_COUNT || newTotalSize > MAX_FILE_SIZE) {
      setAreLimitsExceeded(true);
    } else {
      setAreLimitsExceeded(false);
    }
  }, [files]);

  const handleRemove = React.useCallback(
    (file: ExtendedFile) => {
      setFiles((prevFiles) => prevFiles.filter((_file) => _file.name !== file.name));
      setReport((prevReport: any) => ({
        ...prevReport,
        images: (prevReport.images || []).filter((img: ExtendedFile) => img.name !== file.name),
      }));
    },
    [setReport]
  );

  const handleRemoveAll = React.useCallback(() => {
    setFiles([]);
    setReport((prevReport: any) => ({ ...prevReport, images: [] }));
  }, [setReport]);

  const handleUploadMore = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(event.target.files || []);
    handleDrop(newFiles);
  };

  return (
    <Box sx={{ p: { sm: 0, md: 3 } }}>
      <Stack direction="row" spacing={3} sx={{ alignItems: 'center', justifyContent: 'space-between', py: 2 }}>
        <Typography variant="h6">Upload photos or files</Typography>
        <Typography color="warning.main" variant="body2">
          {`${bytesToSize(MAX_FILE_SIZE)} or ${MAX_FILE_COUNT} files max`}
        </Typography>
        {isProcessing && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              bgcolor: 'rgba(255,255,255,0.8)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1000,
            }}
          >
            <CircularProgress />
            <Typography sx={{ ml: 2 }} variant="body1">
              Processing files: {processingCount} of {totalFilesDropped}. Please wait...
            </Typography>
          </Box>
        )}
      </Stack>

      <Stack spacing={3}>
        <FileDropzone
          accept={ACCEPTED_FILE_TYPES}
          caption={
            areLimitsExceeded ? (
              <span style={{ color: 'red' }}>Max file limit or size exceeded, please remove files.</span>
            ) : (
              <Box>
                <Typography color="secondary" variant="body2" component="span">
                  Max combined size {bytesToSize(MAX_FILE_SIZE)}
                </Typography>
                <Typography color="secondary" variant="body2" component="span">
                  {' '}Max size for single file {bytesToSize(MAX_FILE_SIZE_SINGLE)}
                </Typography>
              </Box>
            )
          }
          disabled={isProcessing || areLimitsExceeded}
          files={files}
          isCameraOpen={isCameraOpen}
          maxFiles={MAX_FILE_COUNT}
          maxSize={MAX_FILE_SIZE_SINGLE}
          onDrop={handleDrop}
          onDropAccepted={handleDropSuccess}
          onDropRejected={handleDropRejected}
          setIsCameraOpen={setIsCameraOpen}
        />
        {files.length ? (
          <Stack spacing={2}>
            <Stack component="ul" spacing={1} sx={{ listStyle: 'none', m: 0, p: 0 }}>
              <Typography sx={{ margin: 'auto' }} color="info.main" variant="h6">
                {files.length} out of {MAX_FILE_COUNT} allowed
              </Typography>
              <Typography sx={{ margin: 'auto' }} color={totalSize <= MAX_FILE_SIZE ? 'info.main' : 'error.main'} variant="h6">
                Total size: {bytesToSize(totalSize)}
                {totalSize > MAX_FILE_SIZE && <span style={{ color: 'red' }}> - Total size exceeded</span>}
              </Typography>
              {files.map((file) => {
                const extension = file.name ? file.name.split('.').pop()?.toLowerCase() : '';
                return (
                  <Stack
                    component="li"
                    direction="row"
                    key={file.name}
                    spacing={2}
                    sx={{
                      alignItems: 'center',
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 1,
                      p: 1,
                    }}
                  >
                    <ImageListItem
                      key={file.name}
                      sx={{
                        width: '150px',
                        height: '100px',
                        overflow: 'hidden',
                      }}
                    >
                      {extension === 'pdf' ? (
                        <object
                          data={file.preview}
                          style={{ objectFit: 'cover', height: '100%', width: '100%' }}
                          type={file.type}
                          aria-label={`Preview of ${file.name}`}
                        />
                      ) : ['mp4', 'mpeg', 'quicktime', 'mov', 'webm'].includes(extension || '') ? (
                        <video
                          className="hidden-ios-video-controls"
                          src={file.preview}
                          autoPlay={false}
                          loop
                          muted
                          controls={false}
                          style={{ objectFit: 'cover', height: '100%', width: '100%' }}
                        />
                      ) : (
                        <img
                          src={file.preview}
                          alt={file.name}
                          loading="lazy"
                          style={{ objectFit: 'cover', height: '100%', width: '100%' }}
                        />
                      )}
                    </ImageListItem>
                    <Box sx={{ flex: '1 1 auto', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '50vw' }}>
                      <Typography variant="subtitle2" sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '50vw' }} component="span">
                        {file.name}
                      </Typography>
                      <Typography color="text.secondary" variant="body2" component="span">
                        {bytesToSize(file.size)}
                      </Typography>
                    </Box>
                    <FileIcon extension={extension || ''} />
                    <Tooltip title="Remove">
                      <IconButton onClick={() => handleRemove(file)}>
                        <XIcon />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                );
              })}
            </Stack>
            {isMobile ? (
              <Stack direction="row" spacing={2} sx={{ alignItems: 'center', flexDirection: 'column' }}>
                <IonButton
                  onClick={handleRemoveAll}
                  sx={{ textDecoration: 'underline', justifyContent: 'center', lineHeight: '1rem' }}
                  variant="primary"
                  color="danger"
                  size="small"
                >
                  <IonIcon slot="start" icon={trash}></IonIcon>
                  Remove all
                </IonButton>
              </Stack>
            ) : (
              <Stack direction="row" spacing={2} sx={{ alignItems: 'center', justifyContent: 'flex-end' }}>
                <Button color="secondary" onClick={handleRemoveAll} size="small" type="button">
                  Remove all
                </Button>
                <Button onClick={handleUploadMore} size="small" type="button" variant="contained">
                  Upload More
                </Button>
              </Stack>
            )}
          </Stack>
        ) : null}
      </Stack>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept={Object.keys(ACCEPTED_FILE_TYPES).join(',')}
        onChange={handleFileInputChange}
        multiple
      />
    </Box>
  );
}
