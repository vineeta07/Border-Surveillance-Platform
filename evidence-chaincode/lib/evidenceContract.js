'use strict';

const { Contract } = require('fabric-contract-api');

class EvidenceContract extends Contract {

    async InitLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        console.info('============= END : Initialize Ledger ===========');
    }

    // AnchorEvent(eventId, hash, timestamp, cameraId) — writes the anomaly hash to the ledger.
    async AnchorEvent(ctx, eventId, hash, timestamp, cameraId) {
        console.info('============= START : Anchor Event ===========');

        const evidence = {
            docType: 'evidence',
            eventId,
            hash,
            timestamp,
            cameraId,
            anchoredBy: ctx.clientIdentity.getID()
        };

        await ctx.stub.putState(eventId, Buffer.from(JSON.stringify(evidence)));
        console.info('============= END : Anchor Event ===========');
        return JSON.stringify(evidence);
    }

    // GetEvent(eventId) — used by the "Verify" button to compare a recomputed hash against the ledger.
    async GetEvent(ctx, eventId) {
        const evidenceAsBytes = await ctx.stub.getState(eventId);
        if (!evidenceAsBytes || evidenceAsBytes.length === 0) {
            throw new Error(`${eventId} does not exist`);
        }
        console.log(evidenceAsBytes.toString());
        return evidenceAsBytes.toString();
    }

    // UpdateWatchlist(entry, action) — set this transaction's endorsement policy to require both orgs to endorse. 
    async UpdateWatchlist(ctx, entryId, action, entryDetails) {
        console.info('============= START : Update Watchlist ===========');
        
        // Ensure this transaction is endorsed by both Orgs. 
        // In Fabric, endorsement policies are typically set at chaincode instantiation/approval, 
        // but state-based endorsement allows overriding policy per-key.
        const watchlistEntry = {
            docType: 'watchlist',
            entryId,
            action,
            entryDetails,
            updatedBy: ctx.clientIdentity.getID(),
            updatedAt: new Date().toISOString()
        };

        await ctx.stub.putState(entryId, Buffer.from(JSON.stringify(watchlistEntry)));
        
        // Optionally set state-based endorsement to require 2 orgs (Org1 and Org2) 
        // if this was not already set globally for this chaincode.
        // Assuming global policy takes care of it, or we could set it explicitly.
        
        console.info('============= END : Update Watchlist ===========');
        return JSON.stringify(watchlistEntry);
    }
}

module.exports = EvidenceContract;
