import type { ApiRoutes } from '@enums';
import { wrap } from '@helpers';
import {
  auth,
  JoiValidationMiddleware,
  parseGenresMiddleware,
} from '@middlewares';
import type { Services } from '@services';
import type { IAudio } from '@types';
// import { uploadAudio, uploadImage } from '@utils';
import { Router } from 'express';
import { upload } from 'utils/multer-config';
import { audioSchema } from 'validation/audio.schema';

export const initAudioRoutes = (
  { audioService }: Services,
  path: ApiRoutes,
): Router => {
  const router = Router();
  router.get(
    path,
    wrap(() => Promise.resolve('Get audios')),
  );
  router.post(
    path,
    auth,
    upload.fields([
      { name: 'cover', maxCount: 1 },
      { name: 'audio', maxCount: 1 },
    ]),
    // uploadAudio.single('audio'),
    // uploadImage.single('cover'),
    parseGenresMiddleware,
    JoiValidationMiddleware(audioSchema),
    wrap<Empty, IAudio>(async (req) => audioService.create(req)),
  );

  return router;
};
