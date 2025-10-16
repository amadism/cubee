/**
 * Types copied from unexported `ofetch` types.
 */

export interface OFetchResponseMap {
  /**
   * The "blob" property of "OFetchResponseMap" is a Blob object that represents
   * the response body as binary data. It is used to retrieve and process binary
   * data from the response within the context of "OFetchResponseMap".
   */
  blob: Blob
  /**
   * The "text" property of the "OFetchResponseMap" interface holds the response
   * body as a string. It is used to retrieve the plain text response from a
   * fetch call within the context of "OFetchResponseMap".
   */
  text: string
  /**
   * The `arrayBuffer` property of `OFetchResponseMap` stores the response data
   * as an `ArrayBuffer`. It is used to access and manipulate binary data within
   * the context of `OFetchResponseMap`.
   */
  arrayBuffer: ArrayBuffer
  /**
   * Represents the stream response of an OFetch request. Used within the
   * context of OFetchResponseMap to specify the type of the "stream" property.
   * \/ stream: ReadableStream<Uint8Array>
   */
  stream: ReadableStream<Uint8Array>
}

/**
 * OFetchResponseType represents the possible response types that can be
 * returned from a fetch request, including 'blob', 'text', 'arrayBuffer',
 * 'stream', and 'json'.
 */
export type OFetchResponseType = keyof OFetchResponseMap | 'json'

/**
 * OFetchMappedType is a type that maps the OFetchResponseType to the
 * corresponding response type from OFetchResponseMap if it exists, otherwise it
 * defaults to the provided JsonType.
 */
export type OFetchMappedType<
  R extends OFetchResponseType,
  JsonType = any
> = R extends keyof OFetchResponseMap ? OFetchResponseMap[R] : JsonType
