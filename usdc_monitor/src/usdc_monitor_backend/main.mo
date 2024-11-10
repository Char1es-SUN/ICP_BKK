import Array "mo:base/Array";

actor usdc_monitor {
    public type TransferRecord = {
        from: Text;
        to: Text;
        amount: Nat;
        timestamp: Int;
    };

    private stable var largeTransfers: [TransferRecord] = [];

    // This function is called to log any large USDC transfers (over 1 million).
    public func logTransfer(from: Text, to: Text, amount: Nat, timestamp: Int): async Bool {
        if (amount > 1_000_000) {
            let record: TransferRecord = { from; to; amount; timestamp };
            largeTransfers := Array.append(largeTransfers, [record]);
            return true;
        };
        return false;
    };

    // Query function to get large transfer records.
    public query func getLargeTransfers(): async [TransferRecord] {
        return largeTransfers;
    };
};
