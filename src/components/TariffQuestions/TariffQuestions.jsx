import React from 'react';
import { useNavigate } from "react-router-dom";
import './TariffQuestions.css';
import { TarifPlansData } from "../../data/TarifPlansData";
import { handlePlanSelection } from "../../config/wayforpay";

const TariffQuestions = () => {
	const navigate = useNavigate();

	// Функція обробки вибору тарифного плану
	const handlePlanClick = async (planId) => {
		// Знаходимо план за ID
		const plan = TarifPlansData.find(p => p.id === planId);
		if (!plan) {
			console.error('План не знайдено:', planId);
			return;
		}

		// Перевірка авторизації
		const token = localStorage.getItem('token');
		if (!token) {
			navigate('/SignIn');
			return;
		}

		// Обробка платежу через WayForPay
		await handlePlanSelection(plan);
	};
	return (
		<section className="tq-section">
			<div className="tq-inner">
				{/* Block 1 */}
				<div className="tq-item">
					<h3 className="tq-title">Чому 386 грн найвигідніша інвестиція для Вас та оточуючих</h3>
					<p className="tq-text">
						30 оригінальних та яскравих привітань всього по <span className="accent">386/30 = 12,87 грн</span> за кожне дають можливість легко й невимушено підняти святковий
						настрій до іменин близького оточення та основних календарних свят протягом цілого року. Такі емоції та увага безцінні особливо в такі
						часи, а з привітайком їх створити ще простіше та неможливо забути про важливе з календарем привітань.
					</p>
					<button 
						className="tq-btn"
						onClick={() => handlePlanClick('yearly')}
					>
						Обрати тариф Річний
					</button>
				</div>

				{/* Block 2 */}
				<div className="tq-item">
					<h3 className="tq-title">Коли краще одразу обрати тарифний план "Привітанатор"</h3>
					<p className="tq-text">
						100 оригінальних та яскравих привітань всього по <span className="accent">985/100 = 9,85 грн</span> дають привід бути на зв'язку з ширшим колом друзів на яких часто не
						вистачає часу, та більше можливостей створити справжні шедеври. Також не забувайте і про себе та подаруйте оригінальні листівки собі
						найкращому для власних соц.мереж.
					</p>
					<button 
						className="tq-btn"
						onClick={() => handlePlanClick('pryvitanator')}
					>
						Обрати тариф Привітанатор
					</button>
				</div>

				{/* Block 3 */}
				<div className="tq-item">
					<h3 className="tq-title">Як тарифний план "Генератор" посилить Ваш Нетворкінг або соц.мережі</h3>
					<p className="tq-text">
						Якщо ви активна ділова людина, то 300 привітань всього по <span className="accent">1987/300 = 6,62 грн</span> за кожне допоможуть підтримувати зв'язки з клієнтами чи
						співробітниками. Для креативних особистостей тариф генератор - це простір експериментів для самовираження. Ви можете створювати
						оригінальні або смішні зображення для власних соцмереж і друзів дуже просто та швидко.
					</p>
					<button 
						className="tq-btn"
						onClick={() => handlePlanClick('generator')}
					>
						Обрати тариф Генератор
					</button>
				</div>

			</div>
		</section>
	);
};

export default TariffQuestions;

