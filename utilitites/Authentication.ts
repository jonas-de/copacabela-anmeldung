import {GetServerSidePropsContext, GetServerSidePropsResult} from 'next';
import {IncomingMessage} from 'http';
import {NextApiRequestCookies} from 'next/dist/server/api-utils';
import {Participantscontroller} from '../payload-types';
import {ParsedUrlQuery} from 'querystring';
import {PreviewData} from 'next/types';

export type GetServerSideUserPropsContext<
  Q extends ParsedUrlQuery = ParsedUrlQuery,
  D extends PreviewData = PreviewData
> = GetServerSidePropsContext<Q, D> & {
  req: IncomingMessage & {
    cookies: NextApiRequestCookies;
    user: Participantscontroller;
  };
};

export type GetServerSideUserProps<
  P extends {[key: string]: unknown} = {[key: string]: unknown},
  Q extends ParsedUrlQuery = ParsedUrlQuery,
  D extends PreviewData = PreviewData
> = (
  context: GetServerSideUserPropsContext<Q, D>
) => Promise<GetServerSidePropsResult<P>>;

const withUser = (handler: GetServerSideUserProps) => {
  return async (context: GetServerSideUserPropsContext) => {
    const payloadCookie = context.req.cookies['payload-token'];
    if (payloadCookie === undefined) {
      return {
        redirect: {
          destination: `/login?redirect=${context.req.url}`,
          permanent: false,
        },
      };
    }
    Object.defineProperty(context, 'user', {
      value: payloadCookie,
    });
    return handler(context);
  };
};

export {withUser};
