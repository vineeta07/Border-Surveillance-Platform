const express = require('express');
const cors = require('cors');

// Note: For a real production app, you would use @hyperledger/fabric-gateway 
// to connect to the peer node. For this demo, we'll implement a mock service 
// that simulates the Fabric gateway so the frontend/backend can interact with 
// it without needing a full Fabric network running on the user's machine, 
// as setting up a full Fabric network locally can be highly complex and 
// environment-dependent.

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// In-memory ledger mock
const mockLedger = new Map();

// AnchorEvent(eventId, hash, timestamp, cameraId)
app.post('/anchor', async (req, res) => {
    try {
        const { eventId, hash, timestamp, cameraId } = req.body;
        
        if (!eventId || !hash) {
            return res.status(400).json({ error: 'eventId and hash are required' });
        }

        const evidence = {
            docType: 'evidence',
            eventId,
            hash,
            timestamp: timestamp || new Date().toISOString(),
            cameraId: cameraId || 'UNKNOWN',
            anchoredBy: 'x509::CN=admin,OU=client,O=Hyperledger,ST=North Carolina,C=US::CN=ca.org1.example.com,O=org1.example.com,L=Durham,ST=North Carolina,C=US'
        };

        // Simulate Fabric transaction latency
        await new Promise(resolve => setTimeout(resolve, 800));
        
        mockLedger.set(eventId, evidence);
        
        res.status(200).json({
            message: 'Event successfully anchored to ledger',
            transactionId: `tx-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            evidence
        });
    } catch (error) {
        console.error('Failed to submit transaction:', error);
        res.status(500).json({ error: error.message });
    }
});

// GetEvent(eventId)
app.get('/verify/:eventId', async (req, res) => {
    try {
        const { eventId } = req.params;
        
        // Simulate Fabric evaluation latency
        await new Promise(resolve => setTimeout(resolve, 400));
        
        if (mockLedger.has(eventId)) {
            const evidence = mockLedger.get(eventId);
            res.status(200).json(evidence);
        } else {
            res.status(404).json({ error: `${eventId} does not exist in ledger` });
        }
    } catch (error) {
        console.error('Failed to evaluate transaction:', error);
        res.status(500).json({ error: error.message });
    }
});

// UpdateWatchlist(entry, action)
app.post('/watchlist', async (req, res) => {
    try {
        const { entryId, action, entryDetails } = req.body;
        
        if (!entryId || !action) {
            return res.status(400).json({ error: 'entryId and action are required' });
        }
        
        const watchlistEntry = {
            docType: 'watchlist',
            entryId,
            action,
            entryDetails,
            updatedBy: 'x509::CN=admin,OU=client...',
            updatedAt: new Date().toISOString()
        };

        // Simulate multi-org endorsement latency
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        mockLedger.set(entryId, watchlistEntry);
        
        res.status(200).json({
            message: 'Watchlist successfully updated with Multi-Sig Endorsement (Org1 + Org2)',
            transactionId: `tx-multi-${Date.now()}`,
            entry: watchlistEntry
        });
    } catch (error) {
        console.error('Failed to submit transaction:', error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Hyperledger Fabric Chain-Gateway (Mock) listening on port ${PORT}`);
    console.log(`Exposed Endpoints:`);
    console.log(`  - POST /anchor`);
    console.log(`  - GET  /verify/:eventId`);
    console.log(`  - POST /watchlist`);
});
