import {NextApiHandler} from "next";
import {supabaseAdmin} from "../../lib/supabaseAdmin";
import {CertificationRequestObj} from "../../lib/types";

const handler: NextApiHandler = async (req, res) => {
    if (req.method !== "POST") return res.status(406).send("Invalid method");

    if (!(req.body.accessCode && req.body.accessCode === process.env.REQUEST_ACCESS_CODE)) return res.status(403).send("Unauthed");

    if (req.body.isHardware === undefined) return res.status(400).send("Missing param");

    let checkParams = [req.body.name, req.body.email, req.body.firmwareVersion, req.body.manufacturerId, req.body.tier, req.body.team];

    checkParams = req.body.isHardware ? [
        ...checkParams,
        req.body.modelName,
        req.body.connectors,
        (req.body.isCreditCard && req.body.cardBrand && req.body.paymentFeatures),
        req.body.powerLevel,
        req.body.mountType,
        req.body.isConcurrent,
        req.body.certificationSupport,
        req.body.featureSupport,
        req.body.isWifi,
        req.body.isSIM,
    ] : [
        ...checkParams,
        req.body.modelId,
        req.body.firmwareInfo,
        req.body.nextUpdate,
        req.body.isFirmwareResponsibility,
    ];

    if (checkParams.includes(undefined)) return res.status(400).send("Missing params");

    try {
        let modelId = req.body.modelId;

        // if new hardware, create model and update model ID
        if (req.body.isHardware) {

        }

        const {name, email, team, firmwareVersion, tier, manufacturerId} = req.body;

        let newRequest: Partial<CertificationRequestObj> = {
            isHardware: req.body.isHardware,
            requesterName: name,
            requesterEmail: email,
            requesterTeam: team,
            firmwareVersion: firmwareVersion,
            tier: tier,
            modelId: modelId,
            manufacturerId: manufacturerId,
        }

        if (!req.body.isHardware) {
            const {firmwareInfo, nextUpdate, isFirmwareResponsibility} = req.body;

            newRequest = {
                ...newRequest,
                firmwareInfo: firmwareInfo,
                nextUpdate: nextUpdate,
                isFirmwareResponsibility: isFirmwareResponsibility,
            }
        }

        const {data, error} = await supabaseAdmin
            .from<CertificationRequestObj>("requests")
            .insert([newRequest]);

        if (error) throw error;

        if (data && data.length) return res.status(200).json({data: data[0]});
    } catch (e) {
        return res.status(500).send(e);
    }
}

export default handler;