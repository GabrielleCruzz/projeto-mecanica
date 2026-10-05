const ctx = document.getElementById("graficoFinanceiro");

const grafico = new Chart(ctx, {
    type: "line",

    data: {
        labels: [
            "Jan",
            "Fev",
            "Mar",
            "Abr",
            "Mai",
            "Jun",
            "Jul",
            "Ago",
            "Set",
            "Out",
            "Nov",
            "Dez"
        ],

        datasets: [{
            label: "Faturamento",

            data: [
                3200,
                4100,
                3800,
                5200,
                6750,
                5800,
                7300,
                5500,
                5800,
                5100
            ],

            borderColor: document.body.classList.contains('dark') ? '#424144' : '#c6d4eb',
            backgroundColor: document.body.classList.contains('dark') ? '#3976ff' : '#1d5cb9',
        }]
    },

    options: {
        responsive: true,
        maintainAspectRatio: false,

        plugins: {
            legend: {
                display: false
            },

            tooltip: {
                callbacks: {
                    label: function(context) {
                        return `R$ ${context.raw}`;
                    }
                }
            }
        }
    }
});