document.addEventListener('DOMContentLoaded', () => {
    const policyTableBody = document.querySelector('#policyTable tbody');
    const policyDetailsModal = document.getElementById('policyDetailsModal');
    const policyDetailsDiv = document.getElementById('policyDetails');
    const createModal = document.getElementById('createModal');
    const readModal = document.getElementById('policyModal');
    const readByIdModal = document.getElementById('readByIdModal');
    const updateModal = document.getElementById('updateModal');
    const updatePolicyForm = document.getElementById('updatePolicyForm');
    const fetchByIdForm = document.getElementById('fetchByIdForm');
    const deleteModal = document.getElementById('deleteModal');
    const modals = [createModal, readModal, readByIdModal, updateModal, deleteModal, policyDetailsModal];
    const closeButtons = document.querySelectorAll('.close');

    // Regular expression for policy number
    const policyNumberRegex = /^PN\d{6}$/;

    // Fetch all policies and populate the table
    const fetchPolicies = async () => {
        try {
            const response = await fetch('/api/policies');
            const policies = await response.json();
            policyTableBody.innerHTML = '';
            policies.forEach(policy => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${policy.id}</td>
                    <td>${policy.policy_number}</td>
                    <td>${policy.insured_party}</td>
                    <td>${policy.coverage_type}</td>
                    <td>${policy.start_date}</td>
                    <td>${policy.end_date}</td>
                    <td>${policy.premium_amount}</td>
                    <td>${policy.status}</td>
                `;
                policyTableBody.appendChild(row);
            });
        } catch (error) {
            console.error('Error fetching policies:', error);
        }
    };

    // Validate policy number
    const validatePolicyNumber = (policyNumber) => {
        return policyNumberRegex.test(policyNumber);
    };

    // Validate Dates
    const validateDates = (startDate, endDate) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const today = new Date();
        if (start > end) {
            alert('Start date cannot be greater than end date.');
            return false;
        }
        if (end <= today) {
            alert('End date must be in the future.');
            return false;
        }
        return true;
    };

    // Create a new policy
    document.getElementById('createPolicyForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const policyNumber = document.getElementById('policyNumber').value;
        const startDate = document.getElementById('policyStartDate').value;
        const endDate = document.getElementById('policyEndDate').value;
        if (!validatePolicyNumber(policyNumber)) {
            alert('Invalid policy number. It should be in the format PNxxxxxx where x is a digit.');
            return;
        }
        if (!validateDates(startDate, endDate)) {
            return;
        }
        const policy = {
            policy_number: policyNumber,
            insured_party: document.getElementById('insuredParty').value,
            coverage_type: document.getElementById('coverageType').value,
            start_date: startDate,
            end_date: endDate,
            premium_amount: document.getElementById('premiumAmount').value,
            status: document.getElementById('policyStatus').value
        };
        try {
            await fetch('/api/policies', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(policy)
            });
            alert('Policy created successfully.');
            fetchPolicies();
        } catch (error) {
            console.error('Error creating policy:', error);
        }
        document.getElementById('createPolicyForm').reset();
        createModal.style.display = 'none';
    });

    // Display fetchById form when update button is clicked
    document.getElementById('updateBtn').addEventListener('click', () => {
        fetchByIdForm.style.display = 'block';
        updatePolicyForm.style.display = 'none';
        // updateModal.style.display = 'block';
    });

    // Fetch policy details by ID and populate the update form
    fetchByIdForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const policyId = document.getElementById('fetch_id').value;
        try {
            const response = await fetch(`/api/policies/${policyId}`);
            if (!response.ok) {
                alert('Invalid ID');
                return;
            }
            const policy = await response.json();
            if (!policy) {
                alert('Invalid ID');
                return;
            }
            // Populate the update form with the fetched policy details
            updatePolicyForm.elements['id'].value = policy.id;
            updatePolicyForm.elements['update_policyNumber'].value = policy.policy_number;
            updatePolicyForm.elements['update_insuredParty'].value = policy.insured_party;
            updatePolicyForm.elements['update_coverageType'].value = policy.coverage_type;
            updatePolicyForm.elements['update_policyStartDate'].value = policy.start_date;
            updatePolicyForm.elements['update_policyEndDate'].value = policy.end_date;
            updatePolicyForm.elements['update_premiumAmount'].value = policy.premium_amount;
            updatePolicyForm.elements['update_policyStatus'].value = policy.status;
            fetchByIdForm.style.display = 'none';
            updatePolicyForm.style.display = 'flex';
            fetchByIdForm.reset();
        } catch (error) {
            console.error('Error fetching policy details:', error);
        }
    });

    // Update an existing policy
    document.getElementById('updatePolicyForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const policyId = document.getElementById('id').value;
        const policyNumber = document.getElementById('update_policyNumber').value;
        const startDate = document.getElementById('update_policyStartDate').value;
        const endDate = document.getElementById('update_policyEndDate').value;
        if (!validatePolicyNumber(policyNumber)) {
            alert('Invalid policy number. It should be in the format PNxxxxxx where x is a digit.');
            return;
        }
        if (!validateDates(startDate, endDate)) {
            return;
        }
        const policy = {
            policy_number: policyNumber,
            insured_party: document.getElementById('update_insuredParty').value,
            coverage_type: document.getElementById('update_coverageType').value,
            start_date: startDate,
            end_date: endDate,
            premium_amount: document.getElementById('update_premiumAmount').value,
            status: document.getElementById('update_policyStatus').value
        };
        try {
            await fetch(`/api/policies/${policyId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(policy)
            });
            alert('Policy updated successfully');
            fetchPolicies();
        } catch (error) {
            console.error('Error updating policy:', error);
        }
        document.getElementById('updatePolicyForm').reset();
        updateModal.style.display = 'none';
    });
    
    // Delete a policy
    document.getElementById('deletePolicyForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const policyId = document.getElementById('delete_id').value;
        try {
            await fetch(`/api/policies/${policyId}`, {
                method: 'DELETE'
            });
            alert('Policy deleted successfully');
            fetchPolicies();
        } catch (error) {
            console.error('Error deleting policy:', error);
        }
        document.getElementById('deletePolicyForm').reset();
        deleteModal.style.display = 'none';
    });

    // Get policy details by ID
    document.getElementById('getPolicyDetailsForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const policyId = document.getElementById('get_id').value;
        try {
            const response = await fetch(`/api/policies/${policyId}`);
            if (!response.ok) {
                alert('Invalid ID');
                return;
            }
            const policy = await response.json();
            if (!policy) {
                alert('Invalid ID');
                return;
            }
            policyDetailsDiv.innerHTML = `
                <h2>Policy Details</h2>
                <p><strong>Id:</strong> ${policy.id}</p>
                <p><strong>Policy Number:</strong> ${policy.policy_number}</p>
                <p><strong>Insured Party:</strong> ${policy.insured_party}</p>
                <p><strong>Coverage Type:</strong> ${policy.coverage_type}</p>
                <p><strong>Policy Start Date:</strong> ${policy.start_date}</p>
                <p><strong>Policy End Date:</strong> ${policy.end_date}</p>
                <p><strong>Premium Amount:</strong> ${policy.premium_amount}</p>
                <p><strong>Policy Status:</strong> ${policy.status}</p>
            `;
            policyDetailsModal.style.display = 'block';
        } catch (error) {
            console.error('Error fetching policy details:', error);
        }
        document.getElementById('getPolicyDetailsForm').reset();
        readByIdModal.style.display = 'none';
    });

    // Event listeners for buttons to open modals
    document.getElementById('createBtn').onclick = () => createModal.style.display = 'block';
    document.getElementById('readBtn').onclick = async () => {
        await fetchPolicies();
        readModal.style.display = 'block';
    };
    document.getElementById('readByIdBtn').onclick = () => readByIdModal.style.display = 'block';
    document.getElementById('updateBtn').onclick = () => updateModal.style.display = 'block';
    document.getElementById('deleteBtn').onclick = () => deleteModal.style.display = 'block';

    // Close modals when clicking on close button or outside the modal
    closeButtons.forEach(button => {
        button.onclick = () => {
            // readByIdModal.style.display = 'none';
            modals.forEach(modal => modal.style.display = 'none');
        };
    });
    window.onclick = (event) => {
        // if (event.target === readByIdModal) {
        //     readByIdModal.style.display = 'none';
        // }
        if (modals.includes(event.target)) {
            modals.forEach(modal => modal.style.display = 'none');
        }
    };

    // Initial fetch of all policies
    fetchPolicies();
});