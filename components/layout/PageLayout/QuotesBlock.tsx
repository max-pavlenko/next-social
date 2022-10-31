import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@mui/material';
import axios from 'axios';
import { auth, firestore } from '../../../libs/firebase';
import { IQuoteData } from '../../../store/User';
import { toastNotify } from '../../../utils/helpers';
import { CheckmarkIcon } from 'react-hot-toast';
import styles from '../../../styles/Blockquote.module.scss'
import { useLocale } from '../../../translations/useLocale';

const QuotesBlock = ({Loader, quoteId = ''}: { Loader: React.ReactElement, quoteId?: string }) => {
   const [ quote, setQuote ] = useState<IQuoteData>({text: "...", author: "...", _id: ''});
   const [ isLoading, setIsLoading ] = useState(true);
   const shouldFetchQuote = useRef(true);
   const [ addedQuoteAsFavorite, setAddedQuoteAsFavorite ] = useState(false);
   const userRef = useRef(firestore.collection('users').doc(auth?.currentUser?.uid));
   const l = useLocale();

   const fetchQuote = useCallback(() => {
      if (!shouldFetchQuote.current) return;
      (async function () {
         await axios.get(`https://api.quotable.io/${quoteId ? 'quotes/' + quoteId : 'random'}`).then((r) => {
            console.log(r.data._id);
            setAddedQuoteAsFavorite(false);
            setQuote({text: r.data.content, author: r.data.author, _id: r.data._id});
            setIsLoading(false);
         });
      })();
      shouldFetchQuote.current = false;
   }, []);

   useEffect(fetchQuote, []);

   const markQuoteAsFavorite = useCallback(async (quote: IQuoteData) => {
      let curState;
      setAddedQuoteAsFavorite((prevState) => {
         curState = !prevState;
         return !prevState;
      });
      await toastNotify({successText: 'updated favorite quote data'}, {
         tryFn: async () => {
            await userRef.current.update({
               favoriteQuoteData: curState ? quote : null
            })
         }
      })
   }, []);

   if (isLoading) return Loader;

   return (
       <blockquote className = "blockquote">
          <p className={styles.blockquote__text}>{`"${quote.text}"`}</p>
          <div className={styles.blockquote}>
             <cite  title = "Source title">
                -- <b>{quote.author}</b>
             </cite>
             {!quoteId && <>
                 <Button
                 size = 'small'
                 className={styles.blockquote__firstBtn}
                 onClick = {() => markQuoteAsFavorite(quote)}
                 variant = "outlined"
                 color = "secondary"
             >
                 <div style={{marginRight: '5px'}}>{addedQuoteAsFavorite && <CheckmarkIcon/>}</div>
                {l.addFavoriteQuote}
             </Button>
                 <Button
                     size = 'small'
                     onClick = {() => {
                        shouldFetchQuote.current = true;
                        setIsLoading(true);
                        fetchQuote();
                     }}
                     variant = "outlined"
                     color = "secondary"
                 >
                    {l.more}...
                 </Button>
             </>
             }
          </div>
       </blockquote>
   );
};

export default QuotesBlock;
