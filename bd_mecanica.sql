-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 06/10/2026 às 17:55
-- Versão do servidor: 10.4.32-MariaDB
-- Versão do PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `bd_mecanica`
--
CREATE DATABASE IF NOT EXISTS `bd_mecanica` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `bd_mecanica`;

-- --------------------------------------------------------

--
-- Estrutura para tabela `cliente`
--

CREATE TABLE `cliente` (
  `ID_cliente` int(11) NOT NULL,
  `Nome` varchar(40) NOT NULL,
  `Telefone` varchar(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `ordemservico`
--

CREATE TABLE `ordemservico` (
  `ID_OrdemServico` int(11) NOT NULL,
  `ID_cliente` int(11) NOT NULL,
  `ID_veiculo` int(11) NOT NULL,
  `Diagnostico` varchar(250) NOT NULL,
  `Nome_mecanico` varchar(40) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `os_peca`
--

CREATE TABLE `os_peca` (
  `ID_OS_peca` int(11) NOT NULL,
  `ID_peca` int(11) NOT NULL,
  `ID_OrdemServico` int(11) NOT NULL,
  `Quantidade` varchar(2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `os_servico`
--

CREATE TABLE `os_servico` (
  `ID_OS_servico` int(11) NOT NULL,
  `ID_tipoServico` int(11) NOT NULL,
  `ID_OrdemServico` int(11) NOT NULL,
  `Valor_unit` decimal(18,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `peca`
--

CREATE TABLE `peca` (
  `ID_peca` int(11) NOT NULL,
  `Nome` varchar(40) NOT NULL,
  `valor_unit` decimal(18,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `tiposervico`
--

CREATE TABLE `tiposervico` (
  `ID_tipoServico` int(11) NOT NULL,
  `tipoServico` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `usuario`
--

CREATE TABLE `usuario` (
  `ID_usuario` int(11) NOT NULL,
  `Nome` varchar(40) NOT NULL,
  `Email` varchar(40) NOT NULL,
  `Cnpj` char(14) NOT NULL,
  `Senha` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `veiculo`
--

CREATE TABLE `veiculo` (
  `ID_veiculo` int(11) NOT NULL,
  `ID_cliente` int(11) NOT NULL,
  `Placa` varchar(7) NOT NULL,
  `Model_Marca` varchar(15) NOT NULL,
  `Ano` year(4) NOT NULL,
  `observacao` varchar(250) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `cliente`
--
ALTER TABLE `cliente`
  ADD PRIMARY KEY (`ID_cliente`);

--
-- Índices de tabela `ordemservico`
--
ALTER TABLE `ordemservico`
  ADD PRIMARY KEY (`ID_OrdemServico`),
  ADD KEY `FK_OS_veiculo` (`ID_veiculo`),
  ADD KEY `FK_OS_cliente` (`ID_cliente`);

--
-- Índices de tabela `os_peca`
--
ALTER TABLE `os_peca`
  ADD PRIMARY KEY (`ID_OS_peca`),
  ADD KEY `FK_OS_peca_peca` (`ID_peca`),
  ADD KEY `FK_OS_peca_ordem` (`ID_OrdemServico`);

--
-- Índices de tabela `os_servico`
--
ALTER TABLE `os_servico`
  ADD PRIMARY KEY (`ID_OS_servico`),
  ADD KEY `FK_OS_servico_tipo` (`ID_tipoServico`),
  ADD KEY `FK_OS_servico_ordem` (`ID_OrdemServico`);

--
-- Índices de tabela `peca`
--
ALTER TABLE `peca`
  ADD PRIMARY KEY (`ID_peca`);

--
-- Índices de tabela `tiposervico`
--
ALTER TABLE `tiposervico`
  ADD PRIMARY KEY (`ID_tipoServico`);

--
-- Índices de tabela `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`ID_usuario`),
  ADD UNIQUE KEY `Email` (`Email`),
  ADD UNIQUE KEY `Cnpj` (`Cnpj`);

--
-- Índices de tabela `veiculo`
--
ALTER TABLE `veiculo`
  ADD PRIMARY KEY (`ID_veiculo`),
  ADD UNIQUE KEY `Placa` (`Placa`),
  ADD KEY `FK_ID_cliente` (`ID_cliente`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `cliente`
--
ALTER TABLE `cliente`
  MODIFY `ID_cliente` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `ordemservico`
--
ALTER TABLE `ordemservico`
  MODIFY `ID_OrdemServico` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `os_peca`
--
ALTER TABLE `os_peca`
  MODIFY `ID_OS_peca` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `os_servico`
--
ALTER TABLE `os_servico`
  MODIFY `ID_OS_servico` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `peca`
--
ALTER TABLE `peca`
  MODIFY `ID_peca` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `tiposervico`
--
ALTER TABLE `tiposervico`
  MODIFY `ID_tipoServico` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `usuario`
--
ALTER TABLE `usuario`
  MODIFY `ID_usuario` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `veiculo`
--
ALTER TABLE `veiculo`
  MODIFY `ID_veiculo` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `ordemservico`
--
ALTER TABLE `ordemservico`
  ADD CONSTRAINT `FK_OS_cliente` FOREIGN KEY (`ID_cliente`) REFERENCES `cliente` (`ID_cliente`),
  ADD CONSTRAINT `FK_OS_veiculo` FOREIGN KEY (`ID_veiculo`) REFERENCES `veiculo` (`ID_veiculo`);

--
-- Restrições para tabelas `os_peca`
--
ALTER TABLE `os_peca`
  ADD CONSTRAINT `FK_OS_peca_ordem` FOREIGN KEY (`ID_OrdemServico`) REFERENCES `ordemservico` (`ID_OrdemServico`),
  ADD CONSTRAINT `FK_OS_peca_peca` FOREIGN KEY (`ID_peca`) REFERENCES `peca` (`ID_peca`);

--
-- Restrições para tabelas `os_servico`
--
ALTER TABLE `os_servico`
  ADD CONSTRAINT `FK_OS_servico_ordem` FOREIGN KEY (`ID_OrdemServico`) REFERENCES `ordemservico` (`ID_OrdemServico`),
  ADD CONSTRAINT `FK_OS_servico_tipo` FOREIGN KEY (`ID_tipoServico`) REFERENCES `tiposervico` (`ID_tipoServico`);

--
-- Restrições para tabelas `veiculo`
--
ALTER TABLE `veiculo`
  ADD CONSTRAINT `FK_ID_cliente` FOREIGN KEY (`ID_cliente`) REFERENCES `cliente` (`ID_cliente`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
