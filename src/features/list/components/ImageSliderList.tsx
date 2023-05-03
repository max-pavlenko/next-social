import React, { FC, MouseEvent } from 'react';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { AdditionalImageData } from '../../posts/forms/PostFormEdit';
import ReactImageMagnify from 'react-image-magnify';
import styles from '../../../../styles/ImageSliderList.module.scss';

type Props = {
   title?: string;
   images: AdditionalImageData[];
   onCloseImgClick?: ((e: MouseEvent, imgID: number) => void) | null;
   maxWidth?: string;
}

const ImageSliderList: FC<Props> = ({ title = 'Additional images', images, onCloseImgClick = null, maxWidth = undefined }) => {
   return (
     <div className="spacer">
        <ul style={maxWidth ? { maxWidth } : {}} className={styles.additionalImagesList}>
           {images.map(({ img, id }) => {
              return (
                <li
                  className={styles.listItem}
                  key={id}
                >
                   {onCloseImgClick && (
                     <IconButton
                       size="small"
                       color="warning"
                       className={styles.deleteImageBtn}
                       onClick={(e) => onCloseImgClick(e, id)}
                     >
                        <CloseIcon />
                     </IconButton>
                   )}

                   <div>
                      <ReactImageMagnify {...{
                         smallImage: {
                            alt: 'Wristwatch by Ted Baker London',
                            width: 200,
                            height: 200,
                            src: img,
                            isFluidWidth: false,
                         },
                         largeImage: {
                            src: img,
                            width: 200,
                            height: 300,
                         },
                         isHintEnabled: true,
                         imageStyle: { objectFit: 'cover' },
                         enlargedImagePosition: 'over',
                         shouldHideHintAfterFirstActivation: true,
                      }} />
                   </div>

                   {/* <img */}
                   {/*     style = {{ */}
                   {/*        objectFit: "cover", */}
                   {/*        maxWidth: "initial", */}
                   {/*        pointerEvents: "none", */}
                   {/*        width: "100%", */}
                   {/*        height: "100%", */}
                   {/*     }} */}
                   {/*     src = {img} */}
                   {/*     alt = "additional image" */}
                   {/* /> */}
                </li>
              );
           })}
        </ul>
        <h3 className={styles.title}>{title}</h3>
        {/*<div style={{
             maxWidth: '1200px',
             margin: '0 auto',
             display: 'flex',
             flexDirection: 'column',
             fontFamily: 'Arial',
             lineHeight: '1.3',
             fontSize: '16px',
          }}>

              <div style={{overflow: 'hidden'}}>
                  <ReactImageMagnify {...{
                      smallImage: {
                          src: images[0].img,
                          width: 300,
                          height: 300,
                      },
                      largeImage: {
                          src: images[0].img,
                          width: 300,
                          height: 600
                      },
                      enlargedImageContainerStyle: {backgroundColor: 'lightcoral', width: '200%'},
                      isHintEnabled: true,
                      lensStyle: {border: '1px dashed salmon'},
                      shouldHideHintAfterFirstActivation: true
                  }} /></div>
          </div>*/}
     </div>
   );
};

export default ImageSliderList;
