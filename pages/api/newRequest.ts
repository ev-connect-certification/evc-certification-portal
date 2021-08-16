import {NextApiHandler} from "next";
import {supabaseAdmin} from "../../lib/supabaseAdmin";
import {CertificationRequestObj, ModelObj} from "../../lib/types";
import generator from "generate-password";

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
        req.body.isHubSatellite,
        req.body.isWSSSingle,
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

        const {name, email, team, firmwareVersion, tier, manufacturerId} = req.body;

        // if new hardware, create model and update model ID
        if (req.body.isHardware) {
            const {
                modelName,
                connectors,
                isCreditCard,
                cardBrand,
                paymentFeatures,
                powerLevel,
                mountType,
                isConcurrent,
                certificationSupport,
                featureSupport,
                isWifi,
                isSIM,
                isHubSatellite,
                isWSSSingle,
                updateFrequency,
            } = req.body;

            const newModel = {
                manufacturerId: manufacturerId,
                name: modelName,
                connectors: connectors,
                isCreditCard: isCreditCard,
                cardBrand: cardBrand,
                paymentFeatures: paymentFeatures || [],
                powerLevel: powerLevel,
                mountType: mountType,
                isConcurrent: isConcurrent,
                certificationSupport: certificationSupport || [],
                featureSupport: featureSupport || [],
                fileKeys: [],
                isWifi: isWifi,
                isSIM: isSIM,
                isHubSatellite: isHubSatellite,
                isWSSSingle: isWSSSingle,
                updateFrequency: updateFrequency,
            }

            const {data: modelData, error: modelError} = await supabaseAdmin.from<ModelObj>("models")
                .insert([newModel]);

            if (modelError) throw modelError;

            if (!(modelData && modelData.length)) return res.status(500).send("Failed to create model");

            modelId = modelData[0].id;
        }

        let newRequest: Partial<CertificationRequestObj> = {
            isHardware: req.body.isHardware,
            requesterName: name,
            requesterEmail: email,
            requesterTeam: team,
            firmwareVersion: firmwareVersion,
            tier: tier,
            modelId: modelId,
            manufacturerId: manufacturerId,
            accessCode: generator.generate({length: 6, numbers: true,}),
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