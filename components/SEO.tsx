import {NextSeo} from "next-seo";
import {useRouter} from "next/router";

export default function SEO({
                                  title = "EV Connect Certification Portal",
                                  description = "Check the certification status of charger models and request new software and hardware certifications.",
                                  imgUrl = null,
                                  authorUsername = null,
                                  publishedDate = null,
                                  noindex = false,
                              }: { title?: string, description?: string, imgUrl?: string, authorUsername?: string, publishedDate?: string, noindex?: boolean }) {
    const router = useRouter();
    const fullTitle = title + (router.asPath === "/" ? "" : " | EV Connect Certification Portal");

    let openGraph = {
        title: fullTitle,
        description: description,
        // url: "https://prm.szh.land" + router.asPath,
        // images: imgUrl ? [
        //     { url: imgUrl }
        // ] : [
        //     { url: "https://your-domain.com/defaultImage.png" }
        // ],
    };

    // let twitter = {
    //     site: "@wwsalmon",
    //     cardType: imgUrl ? "summary_large_image" : "summary",
    // };

    return (
        <NextSeo
            title={fullTitle}
            description={description}
            openGraph={openGraph}
            // twitter={twitter}
            noindex={noindex}
        />
    );
}