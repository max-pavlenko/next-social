import fetch from 'node-fetch';
import { NextApiRequest, NextApiResponse } from 'next';

const sleep = () => new Promise<void>((resolve) => {
  setTimeout(() => {
    resolve();
  }, 350);
});

function hasCaptchaProperty(obj: any): obj is { captcha: string } {
  return typeof obj === 'object' && obj !== null && 'captcha' in obj && typeof obj['captcha'] === 'string';
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { body, method } = req;

  if(!hasCaptchaProperty(body)) return res.status(422).json({
    message: "Unproccesable request, no captcha property"
  });

  const { captcha } = body;

  if (method === "POST" && !captcha) {
    return res.status(422).json({
      message: "Unproccesable request, please provide the required fields"
    });
  }

  try {
    const response = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.NEXT_PUBLIC_RECAPTCHA_SECRET_KEY}&response=${captcha}`,
      {
         headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
         },
         method: 'POST',
      },
    );
    const captchaValidation = await response.json() as { success: boolean, challenge_ts: Date, hostname: string, 'error-codes': string[] };
    if (captchaValidation.success) {
      // Replace this with the API that will save the data received
      // to your backend
      return res.status(200).send("OK");
    }

    return res.status(422).json({
      message: "Unproccesable request, Invalid captcha code"
    });
  } catch (error) {
    console.log(error);
    return res.status(422).json({ message: "Something went wrong" });
  }
}
