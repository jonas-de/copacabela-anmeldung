import { GetServerSidePropsResult, GetServerSidePropsContext, GetServerSideProps } from 'next';
import { IncomingMessage } from 'http';
import { NextApiRequestCookies } from 'next/dist/server/api-utils';
import { TeilnehmendenverwalterIn, User } from '../../payload-types';
import { ParsedUrlQuery } from 'querystring';
import { PreviewData } from 'next/types';

export type GetServerSideUserPropsContext<
  Q extends ParsedUrlQuery = ParsedUrlQuery,
  D extends PreviewData = PreviewData
  > = GetServerSidePropsContext<Q, D> & { req: IncomingMessage & { cookies: NextApiRequestCookies, user: TeilnehmendenverwalterIn } }

export type GetServerSideUserProps<
  P extends { [key: string]: any } = { [key: string]: any },
  Q extends ParsedUrlQuery = ParsedUrlQuery,
  D extends PreviewData = PreviewData
  > = (context: GetServerSideUserPropsContext<Q, D>) => Promise<GetServerSidePropsResult<P>>

const withUser = (handler: GetServerSideUserProps) => {
  return async (context: GetServerSideUserPropsContext) => {

    const user = context.req.user
    const payloadCookie = context.req.cookies["payload-token"]
    if (payloadCookie === undefined) {
      return {
        redirect: {
          destination: `/login?redirect=${context.req.url}`,
          permanent: false
        }
      }
    }
    Object.defineProperty(context, "user", {
      value: payloadCookie
    })
    return handler(context)
  }
}

export { withUser }
