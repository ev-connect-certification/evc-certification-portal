import {NextApiHandler} from "next";
import {res200, res400, res403, res404, res405, res500} from "../../lib/apiResponses";
import multiparty from "multiparty";
import {supabaseAdmin} from "../../lib/supabaseAdmin";
import {readFileSync} from "fs";
import {TestObj} from "../../lib/types";
import {supabase} from "../../lib/supabaseClient";

export const config = {
    api: {
        bodyParser: false,
    }
};

const handler: NextApiHandler = async (req, res) => {
    if (req.method !== "POST") return res405(res);

    const {user} = await supabase.auth.api.getUserByCookie(req);

    if (!user) return res403(res);

    if (!req.query.testId) return res400(res);

    const form = new multiparty.Form();

    try {
        form.parse(req, async (e, _, files) => {
            // upload fault code file

            const configFile = files.config[0];

            if (!configFile) return res400(res);

            const configBuffer = readFileSync(configFile.path);

            const {data, error} = await supabaseAdmin
                .storage
                .from("test-files")
                .upload(
                    `${req.query.testId}/${configFile.originalFilename}`,
                    configBuffer,
                    {contentType: configFile.headers["content-type"]},
                );

            if (error) throw error;

            console.log(data);

            return res200(res, {});
        });
    } catch (e) {
        return res500(res, e);
    }
}

export default handler;