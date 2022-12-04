import React from "react";
import {IconButton} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {AdditionalImageData} from "../Forms/PostFormEdit";
import ReactImageMagnify from 'react-image-magnify'

const ImageSlider = ({
                        title = "Additional images",
                        images,
                        onCloseImgClick = null,
                        maxWidth = undefined,
                     }: {
   title?: string;
   images: AdditionalImageData[];
   onCloseImgClick?: ((e: any, imgID: number) => void) | null;
   maxWidth?: string | undefined;
}) => {
   return (
       <div className = "spacer">
          <ul style = {maxWidth && {maxWidth}} className = "additionalImagesList">
             {images.map(({img, id}) => {
                 return (
                    <div key = {id}>
                       <li
                           style = {{
                              width: "200px",
                              position: "relative",
                              height: "100%",
                              margin: '0 auto',
                              display: 'flex',
                              flexDirection: 'column',
                              lineHeight: '1.3',
                              fontSize: '16px',
                           }}
                           key = {id}
                       >
                          {onCloseImgClick && (
                              <IconButton
                                  size = "small"
                                  color = "warning"
                                  style = {{
                                     position: "absolute",
                                     top: "5px",
                                     right: "5px",
                                     mixBlendMode: "difference",
                                     backdropFilter: "blur(1.2px)",
                                      zIndex: 100,
                                  }}
                                  onClick = {(e)=>onCloseImgClick(e, id)}
                              >
                                 <CloseIcon/>
                              </IconButton>
                          )}
                           {/* @ts-ignore*/}
                           <div><ReactImageMagnify {...{
                               smallImage: {
                                   alt: 'Wristwatch by Ted Baker London',
                                   width: 200,
                                   height: 200,
                                   src: img,
                               },
                               largeImage: {
                                   src: img,
                                   width: 200,
                                   height: 300
                               },
                               isHintEnabled: true,
                               imageStyle: {objectFit: 'cover'},
                               enlargedImagePosition: 'over',
                               shouldHideHintAfterFirstActivation: true,
                           }} /></div>

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
                    </div>
                );
             })}
          </ul>
          <h3 style = {{textAlign: "center", marginTop: "5px"}}>{title}</h3>
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

export default ImageSlider;
