<?php

// Allow from any origin
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');    // cache for 1 day
}

// Access-Control headers are received during OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {

    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS");         

    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
        header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");

    exit(0);
}


// Conexão com o banco de dados
$pdo = new PDO('pgsql:host=localhost port=5432 dbname=teste_zievo user=postgres password=user321 connect_timeout=10 sslmode=prefer');

// Função para cadastrar um produto
function cadastrarProduto($name, $type_id, $price) {
    global $pdo;
    $stmt = $pdo->prepare("INSERT INTO products (name, type_id, price) VALUES (?, ?, ?)");
    $stmt->execute([$name, $type_id, $price]);
    return $pdo->lastInsertId();
}

// Função para cadastrar um tipo de produto
function cadastrarTipoProduto($name, $tax_rate) {
    global $pdo;
    $stmt = $pdo->prepare("INSERT INTO product_types (name, tax_rate) VALUES (?, ?)");
    $stmt->execute([$name, $tax_rate]);
    return $pdo->lastInsertId();
}

// Função para cadastrar vendas
function cadastrarVenda($items) {
    global $pdo;
    $total_amount = 0;
    $total_tax = 0;

    // Iniciar uma transação
    $pdo->beginTransaction();

    try {
        // Inserir uma nova venda com total_amount e total_tax inicialmente definidos como zero
        $stmt = $pdo->prepare("INSERT INTO sales (total_amount, total_tax) VALUES (?, ?)");
        $stmt->execute([$total_amount, $total_tax]);
        $sale_id = $pdo->lastInsertId();

        // Iterar sobre os itens vendidos
        foreach ($items as $item) {
            // Inserir um novo item de venda na tabela sale_items
            $stmt = $pdo->prepare("INSERT INTO sale_items (sale_id, product_id, quantity, subtotal, tax_amount) VALUES (?, ?, ?, ?, ?)");
            $stmt->execute([$sale_id, $item['product_id'], $item['quantity'], $item['subtotal'], $item['tax_amount']]);
            
            // Somar os subtotais e valores de imposto para calcular o total_amount e total_tax
            $total_amount += $item['subtotal'];
            $total_tax += $item['tax_amount'];
        }

        // Atualizar a venda com os valores calculados de total_amount e total_tax
        $stmt = $pdo->prepare("UPDATE sales SET total_amount = ?, total_tax = ? WHERE id = ?");
        $stmt->execute([$total_amount, $total_tax, $sale_id]);

        // Commit da transação
        $pdo->commit();
        
        return true; // Venda realizada com sucesso
    } catch (Exception $e) {
        // Rollback em caso de erro
        $pdo->rollback();
        return false; // Erro ao realizar a venda
    }
}

// Função para obter todas as vendas com os itens associados
function obterVendasComItens() {
    global $pdo;

    // Consulta SQL para selecionar todas as vendas com os itens associados
    $sql = "SELECT s.id, s.sale_date, s.total_amount, s.total_tax, si.product_id, si.quantity, si.subtotal, si.tax_amount
            FROM sales s
            INNER JOIN sale_items si ON s.id = si.sale_id";

    // Preparar e executar a consulta
    $stmt = $pdo->prepare($sql);
    $stmt->execute();

    // Extrair os resultados da consulta
    $vendas = array();
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        // Verificar se a venda já está no array de vendas
        if (!isset($vendas[$row['id']])) {
            // Se não estiver, criar uma entrada para essa venda no array
            $vendas[$row['id']] = array(
                'id' => $row['id'],
                'sale_date' => $row['sale_date'],
                'total_amount' => $row['total_amount'],
                'total_tax' => $row['total_tax'],
                'itens' => array()
            );
        }

        // Adicionar o item da venda ao array de itens da venda
        $vendas[$row['id']]['itens'][] = array(
            'product_id' => $row['product_id'],
            'quantity' => $row['quantity'],
            'subtotal' => $row['subtotal'],
            'tax_amount' => $row['tax_amount']
        );
    }

    // Retornar o array de vendas
    return array_values($vendas);
}


// Função para obter todos os produtos cadastrados
function obterTodosProdutos() {
    global $pdo;
    $stmt = $pdo->query("SELECT * FROM products");
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}



// Função para obter todos os tipos de produtos cadastrados
function obterTodosTiposProdutos() {
    global $pdo;
    $stmt = $pdo->query("SELECT * FROM product_types");
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

 // Exemplo de uso
/* 
// Cadastro de tipos de produto
$categoria1_id = cadastrarTipoProduto("vestuario", 10); // Taxa de imposto 10%
$categoria2_id = cadastrarTipoProduto("alimentação", 15); // Taxa de imposto 15%

// Cadastro de produtos
$produto1_id = cadastrarProduto("Blusa", $categoria1_id, 50); // Preço R$ 50
$produto2_id = cadastrarProduto("Sorvete", $categoria2_id, 100); // Preço R$ 100

// Realização de venda
realizarVenda([
    ['product_id' => $produto1_id, 'quantity' => 2], // 2 unidades do Produto 1
    ['product_id' => $produto2_id, 'quantity' => 1]  // 1 unidade do Produto 2
]);  */