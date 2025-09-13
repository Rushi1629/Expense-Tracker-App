import { firestore } from "@/config/firebase";
import { ResponseType, TransactionType, WalletType } from "@/types";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { UploadFileToCloudinary } from "./imageService";
import { createOrUpdateWallet } from "./walletService";

export const createOrUpdateTransaction = async (
  transactionData: Partial<TransactionType>
): Promise<ResponseType> => {
  try {
    const { id, type, walletId, amount, image } = transactionData;

    if (!amount || amount <= 0 || !walletId || !type) {
      return {
        success: false,
        msg: "Invalid transaction data!",
      };
    }

    if (id) {
      const oldTransactionSnapshot = await getDoc(
        doc(firestore, "transactions", id)
      );

      const oldTransaction = oldTransactionSnapshot.data() as TransactionType;

      const shouldRevertOriginal =
        oldTransaction.type != type ||
        oldTransaction.amount != amount ||
        oldTransaction.walletId != walletId;

      if (shouldRevertOriginal) {
        let res = await revertAndUpdateWallets(
          oldTransaction,
          Number(amount),
          type,
          walletId
        );
        if (!res.success) return res;
      }
    } else {
      // Update wallrt for new transaction
      let res = await updateWalletForNewTransaction(
        walletId!,
        Number(amount!),
        type
      );
      if (!res.success) return res;
    }

    if (image) {
      const imageUploadRes = await UploadFileToCloudinary(image, "transaction");
      if (!imageUploadRes.success) {
        return {
          success: false,
          msg: imageUploadRes.msg || "Failed to upload receipt",
        };
      }
      transactionData.image = imageUploadRes.data;
    }
    // else {
    //   // 🚑 ensure Firestore never gets undefined
    //   delete transactionData.image;
    // }

    const transactionRef = id
      ? doc(firestore, "transactions", id)
      : doc(collection(firestore, "transactions"));

    await setDoc(transactionRef, transactionData, {
      merge: true,
    });

    return {
      success: true,
      data: {
        ...transactionData,
        id: transactionRef.id,
      },
      // msg:
      //   type == "expense"
      //     ? "Expense Added Successfully."
      //     : "Income Added Successfully.",
      msg: id
        ? type == "expense"
          ? "Expense Updated Successfully."
          : "Income Updated Successfully."
        : type == "expense"
        ? "Expense Added Successfully."
        : "Income Added Successfully.",
    };
  } catch (err: any) {
    // console.log("Error creating or updating transaction : ", err);
    return {
      success: false,
      msg: err.message,
    };
  }
};

const updateWalletForNewTransaction = async (
  WalletId: string,
  amount: number,
  type: string
) => {
  try {
    const walletRef = doc(firestore, "wallets", WalletId);

    const walletSnapShot = await getDoc(walletRef);

    if (!walletSnapShot.exists()) {
      // console.log("Error updating wallet for new transaction");
      return {
        success: false,
        msg: "Wallet not found",
      };
    }

    const walletData = walletSnapShot.data() as WalletType;

    if (type == "expense" && walletData.amount! - amount < 0) {
      return {
        success: false,
        msg: "Selected wallet don't have enough balance",
      };
    }

    const updateType = type == "income" ? "totalIncome" : "totalExpenses";

    const updateWalletAmount =
      type == "income"
        ? Number(walletData.amount) + amount
        : Number(walletData.amount) - amount;

    const updateTotals =
      type == "income"
        ? Number(walletData.totalIncome) + amount
        : Number(walletData.totalExpenses) + amount;

    await updateDoc(walletRef, {
      amount: updateWalletAmount,
      [updateType]: updateTotals,
    });

    return {
      success: true,
    };
  } catch (err: any) {
    // console.log("Error updating wallet for new transaction: ", err);
    return {
      success: false,
      msg: err.message,
    };
  }
};

const revertAndUpdateWallets = async (
  oldTransaction: TransactionType,
  newTransactionAmount: number,
  newTransactionType: string,
  newWalletId: string
) => {
  try {
    const originalWalletSnapshot = await getDoc(
      doc(firestore, "wallets", oldTransaction.walletId)
    );

    const originalWallet = originalWalletSnapshot.data() as WalletType;

    let newWalletSnapshot = await getDoc(
      doc(firestore, "wallets", newWalletId)
    );

    let newWallet = newWalletSnapshot.data() as WalletType;

    const revertType =
      oldTransaction.type == "income" ? "totalIncome" : "totalExpenses";

    const revertIncomeExpense: number =
      oldTransaction.type == "income"
        ? -Number(oldTransaction.amount)
        : Number(oldTransaction.amount);

    const revertWalletAmount =
      Number(originalWallet.amount) + revertIncomeExpense;
    // wallet amount,after the transaction is removed

    const revertedIncomeExpenseAmount =
      Number(originalWallet[revertType]) - Number(oldTransaction.amount);

    if (newTransactionType == "expense") {
      // if user tries to convert income to expense on the same wallet
      // or if the user tries to increase the expense amount and don't have enough balance
      if (
        oldTransaction.walletId == newWalletId &&
        revertWalletAmount < newTransactionAmount
      ) {
        return {
          success: false,
          msg: "The selected wallet don't have enough balance",
        };
      }

      // if user tries to add expense from a new wallet but the wallet don't have enough balance
      if (newWallet.amount! < newTransactionAmount) {
        return {
          success: false,
          msg: "The selected wallet don't have enough balance",
        };
      }
    }

    await createOrUpdateWallet({
      id: oldTransaction.walletId,
      amount: revertWalletAmount,
      [revertType]: revertedIncomeExpenseAmount,
    });

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //  refetch the newwallet because we may have just updated it

    newWalletSnapshot = await getDoc(doc(firestore, "wallets", newWalletId));

    newWallet = newWalletSnapshot.data() as WalletType;

    const updateType =
      newTransactionType === "income" ? "totalIncome" : "totalExpenses";

    const updatedTransactionAmount: number =
      newTransactionType == "income"
        ? Number(newTransactionAmount)
        : -Number(newTransactionAmount);

    const newWalletAmount = Number(newWallet.amount) + updatedTransactionAmount;

    const newIncomeExpenseAmount = Number(
      newWallet[updateType]! + Number(newTransactionAmount)
    );

    await createOrUpdateWallet({
      id: newWalletId,
      amount: newWalletAmount,
      [updateType]: newIncomeExpenseAmount,
    });

    return {
      success: true,
    };
  } catch (err: any) {
    // console.log("Error updating wallet for new transaction: ", err);
    return {
      success: false,
      msg: err.message,
    };
  }
};

export const deleteTransaction = async (
  transactionId: string,
  walletId: string
) => {
  try {
    const transactionRef = doc(firestore, "transactions", transactionId);
    const transactionSnapShot = await getDoc(transactionRef);

    if (!transactionSnapShot.exists()) {
      return {
        success: false,
        msg: "Transaction Not Found",
      };
    }

    const transactionData = transactionSnapShot.data() as TransactionType;

    const transactionType = transactionData?.type;
    const transactionAmount = transactionData?.amount;

    // fetch wallet to update amount,totalIncome or totalExpense

    const walletSnapShot = await getDoc(doc(firestore, "wallets", walletId));

    if (!walletSnapShot.exists()) {
      return {
        success: false,
        msg: "Wallet not found",
      };
    }

    const walletData = walletSnapShot.data() as WalletType;

    // check fields to be updated based on transaction type

    const updateType =
      transactionType == "income" ? "totalIncome" : "totalExpenses";

    const newWalletAmount =
      walletData?.amount! -
      (transactionType == "income" ? transactionAmount : -transactionAmount);

    const newIncomeExpenseAmount = walletData[updateType]! - transactionAmount;

    // if its  expense and the wallet amount can go below zero

    if (transactionType == "expense" && newWalletAmount < 0) {
      return {
        success: false,
        msg: "You cannot delete this transaction",
      };
    }

    await createOrUpdateWallet({
      id: walletId,
      amount: newWalletAmount,
      [updateType]: newIncomeExpenseAmount,
    });

    await deleteDoc(transactionRef);

    return {
      success: true,
    };
  } catch (err: any) {
    return {
      success: false,
      msg: err.message,
    };
  }
};
