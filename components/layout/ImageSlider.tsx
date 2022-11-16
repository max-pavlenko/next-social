import React from "react";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { AdditionalImageData } from "../Forms/PostFormEdit";

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
                                  }}
                                  onClick = {(e)=>onCloseImgClick(e, id)}
                              >
                                 <CloseIcon/>
                              </IconButton>
                          )}

                          <img
                              style = {{
                                 objectFit: "cover",
                                 maxWidth: "initial",
                                 pointerEvents: "none",
                                 width: "100%",
                                 height: "100%",
                              }}
                              src = {img}
                              alt = "additional image"
                          />
                       </li>
                    </div>
                );
             })}
          </ul>
          <h3 style = {{textAlign: "center", marginTop: "5px"}}>{title}</h3>
       </div>
   );
};

export default ImageSlider;
