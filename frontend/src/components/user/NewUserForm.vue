<script>
import { Const } from '@/utils/constants';
import axios from 'axios';
import { Toast } from 'bootstrap/dist/js/bootstrap.bundle';

export default {
    data() {
        return {
            formData: {
                name: '',
                phone: '',
                email: '',
                password: '',
            },
            loading: false,
            formSubmitted: false,
            toastElement: null
        };
    },

    mounted() {
        this.toastElement = new Toast(document.getElementById('newUser-toast'))
    },

    methods: {
        showToastMessage(message) {
            const toastEl = document.getElementById('newUser-toast')
            toastEl.querySelector('.toast-body').textContent = message
            this.toastElement.show()
        },
        async handleSubmit() {
            try {
                this.loading = true
                const res = await axios.post(`${Const.BASE_URL}users/create`, this.formData)

                if (res.data.status !== 200) throw new Error
                this.showToastMessage('User succesfully created')
                setTimeout(() => {
                    window.location.reload();
                }, 1000);

            } catch (error) {
                console.error(error)
                this.showToastMessage('Failed to create user, please try again')
            } finally {
                this.loading = false
            }
        },

        resetForm() {
            this.formData = {
                name: '',
                phone: '',
                email: '',
                password: '',
            };

            this.formSubmitted = true
        }
    },
};
</script>


<template>
    <div>
        <form @submit.prevent="handleSubmit">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">New User</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label for="name" class="form-label">Name</label>
                            <input type="text" class="form-control" id="name" v-model="formData.name" required>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label for="phone" class="form-label">Phone</label>
                            <input type="tel" class="form-control" id="phone" v-model="formData.phone" required>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label for="email" class="form-label">Email</label>
                            <input type="email" class="form-control" id="email" v-model="formData.email" required>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label for="password" class="form-label">Password</label>
                            <input type="password" class="form-control" id="password" v-model="formData.password"
                                required>
                        </div>

                    </div>

                </div>
                <div class="modal-footer">
                    <button type="button" class="btn me-auto" data-bs-dismiss="modal">Close</button>
                    <button type="submit" class="btn btn-primary" :disabled="loading"><span
                            v-if="loading">Submitting...</span>
                        <span v-if="!loading">Submit</span>
                    </button>
                </div>

            </div>
        </form>

        <div class="position-absolute top-0 start-50 translate-middle-x p-3" style="z-index: 11">
            <div id="newUser-toast" class="toast align-items-center" role="alert" aria-live="assertive"
                aria-atomic="true">
                <div class="d-flex">
                    <div class="toast-body"></div>
                    <button type="button" class="btn-close ms-auto me-2" aria-label="Close" @click="hideToast"></button>
                </div>
            </div>
        </div>
    </div>
</template>



<style>
.form {
    display: flex;
    flex-direction: column;

}
</style>