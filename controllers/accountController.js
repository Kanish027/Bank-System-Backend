import Account from "../models/accountSchema.js";

const transactions = async (req, res) => {
  try {
    const account = await Account.findOne({ userId: req.user._id });
    if (!account) {
      return res.status(404).json({
        success: false,
        message: "Account not found",
      });
    }
    res.status(200).json({
      success: true,
      transactions: account,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deposit = async (req, res) => {
  try {
    const { amount } = req.body;
    const account = await Account.findOne({ userId: req.user._id });
    if (!account) {
      return res.status(404).json({
        success: false,
        message: "Account not found",
      });
    }

    account.balance += amount;
    account.transactions.push({ type: "deposit", amount });
    await account.save();

    res.status(200).json({
      success: true,
      message: "Money Deposit Successfully",
      balance: account,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const withdraw = async (req, res) => {
  try {
    const { amount } = req.body;
    const account = await Account.findOne({ userId: req.user._id });

    if (amount > account.balance) {
      return res.status(400).send({ message: "Insufficient Funds" });
    }
    account.balance -= amount;
    account.transactions.push({ type: "withdraw", amount });
    await account.save();

    res.status(200).json({
      success: true,
      message: "Money withdraw successfully",
      balance: account.balance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const account = async (req, res) => {
  try {
    if (req.user.role !== "banker") {
      return res.status(403).send({ message: "Access denied" });
    }

    const accounts = await Account.find().populate("userId");
    res.status(200).json({
      success: true,
      accounts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export { transactions, deposit, withdraw, account };
