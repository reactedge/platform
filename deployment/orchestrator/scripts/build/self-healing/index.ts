const contract =
    await contractLoader.load();

const validationResult =
    await validator.validate(
        contract
    );

const errors =
    await errorResolver.resolve(
        validationResult
    );

const repairPlan =
    await repairRegistry.find(
        errors
    );

const approval =
    await approvalProvider.request(
        repairPlan
    );

if (!approval.approved) {
    return;
}

const repairedContract =
    await repairExecutor.execute(
        contract,
        repairPlan
    );

const revalidationResult =
    await validator.validate(
        repairedContract
    );