import Document, { Head, Main, NextScript } from 'next/document';

export default class extends Document {
    render () {
        return (
            <html>
                <Head>
                    <link rel="stylesheet" href="/_next/static/style.css" />
                </Head>
                <body>
                    <Main/>
                    <NextScript/>
                </body>
            </html>
        )
    }
}