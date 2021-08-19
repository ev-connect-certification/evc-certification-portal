import {NextApiHandler} from "next";
import {res200, res400, res403, res405, res500} from "../../lib/apiResponses";
import multiparty from "multiparty";
import {supabaseAdmin} from "../../lib/supabaseAdmin";
import {readFileSync} from "fs";

const fs = require("fs");

export const config = {
    api: {
        bodyParser: false,
    }
};

const handler: NextApiHandler = async (req, res) => {
    if (req.method !== "POST") return res405(res);

    if (!(req.query.modelId && req.query.manufacturerId && req.query.accessCode)) return res400(res);

    if (req.query.accessCode !== process.env.REQUEST_ACCESS_CODE) return res403(res);

    const form = new multiparty.Form();

    try {
        await Promise.all(form.parse(req, async (e, _, files) => {
            // upload fault code file

            const faultCodeFile = files.faultCode[0];

            if (!faultCodeFile) return res400(res);

            const faultCodeBuffer = readFileSync(faultCodeFile.path);

            const {data, error} = await supabaseAdmin
                .storage
                .from("model-files")
                .upload(
                    `${req.query.manufacturerId}/${req.query.modelId}/faultCode/${faultCodeFile.originalFilename}`,
                    faultCodeBuffer,
                    {contentType: faultCodeFile.headers["content-type"]},
                );

            if (error) throw error;

            const otherFiles = files.otherFiles;
            if (otherFiles.length) {
                for (let file of otherFiles) {
                    const fileBuffer = readFileSync(file.path);

                    const {data, error} = await supabaseAdmin
                        .storage
                        .from("model-files")
                        .upload(
                            `${req.query.manufacturerId}/${req.query.modelId}/other/${file.originalFilename}`,
                            fileBuffer,
                            {contentType: file.headers["content-type"]},
                        );

                    if (error) throw error;
                }
            }

            return res200(res, {});
        }));
    } catch (e) {
        console.log(e);
        return res500(res, e);
    }
};

export default handler;